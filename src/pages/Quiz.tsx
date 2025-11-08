import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const questions = [
  {
    id: 1,
    question: "Какая временная сложность у сортировки пузырьком?",
    options: [
      { id: "a", text: "O(n)", correct: false },
      { id: "b", text: "O(n²)", correct: true },
      { id: "c", text: "O(log n)", correct: false },
      { id: "d", text: "O(n log n)", correct: false },
    ],
    explanation: "Сортировка пузырьком имеет два вложенных цикла, что дает квадратичную сложность O(n²)."
  },
  {
    id: 2,
    question: "Какое условие необходимо для работы бинарного поиска?",
    options: [
      { id: "a", text: "Массив должен быть отсортирован", correct: true },
      { id: "b", text: "Массив должен содержать уникальные элементы", correct: false },
      { id: "c", text: "Массив должен быть заполнен числами", correct: false },
      { id: "d", text: "Массив должен быть четной длины", correct: false },
    ],
    explanation: "Бинарный поиск работает только на отсортированных массивах, так как он делит массив пополам."
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const question = questions[currentQuestion];

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      toast.error("Пожалуйста, выберите ответ");
      return;
    }

    const correct = question.options.find(opt => opt.id === selectedAnswer)?.correct || false;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (!correct) {
      setIsLoadingAI(true);
      try {
        const { data, error } = await supabase.functions.invoke("quiz-ai-helper", {
          body: {
            question: question.question,
            userAnswer: question.options.find(opt => opt.id === selectedAnswer)?.text,
            correctAnswer: question.options.find(opt => opt.correct)?.text,
            explanation: question.explanation
          }
        });

        if (error) throw error;

        setAiExplanation(data.explanation);
      } catch (error) {
        console.error("Error getting AI explanation:", error);
        toast.error("Не удалось получить объяснение от AI");
        setAiExplanation(question.explanation);
      } finally {
        setIsLoadingAI(false);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setIsSubmitted(false);
      setAiExplanation("");
    } else {
      toast.success("Вы завершили тест!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад на главную
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Проверка знаний
          </h1>
          <p className="text-muted-foreground text-lg">
            Вопрос {currentQuestion + 1} из {questions.length}
          </p>
        </div>

        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="text-2xl">{question.question}</CardTitle>
            <CardDescription>Выберите правильный ответ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={isSubmitted}>
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-smooth ${
                      isSubmitted && option.correct
                        ? "border-success bg-success/10"
                        : isSubmitted && selectedAnswer === option.id && !option.correct
                        ? "border-destructive bg-destructive/10"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer text-base">
                      {option.text}
                    </Label>
                    {isSubmitted && option.correct && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {isSubmitted && selectedAnswer === option.id && !option.correct && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>

            {isSubmitted && (
              <Card className={`border-2 ${isCorrect ? "border-success" : "border-primary"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-success" />
                        Правильно!
                      </>
                    ) : (
                      <>AI-помощник объясняет:</>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAI ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Генерирую персональное объяснение...
                    </div>
                  ) : (
                    <p className="text-foreground">{isCorrect ? question.explanation : aiExplanation || question.explanation}</p>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 gradient-primary hover:opacity-90"
                  size="lg"
                >
                  Проверить ответ
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex-1 gradient-primary hover:opacity-90"
                  size="lg"
                >
                  {currentQuestion < questions.length - 1 ? "Следующий вопрос" : "Завершить тест"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;