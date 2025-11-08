import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, Code, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { TheorySection } from "@/components/TheorySection";

const algorithms = {
  "bubble-sort": {
    title: "Сортировка пузырьком",
    description: "Алгоритм последовательно сравнивает соседние элементы и меняет их местами, если они находятся в неправильном порядке.",
    complexity: "O(n²)",
    defaultCode: `function bubbleSort(arr, visualize) {
  const n = arr.length;
  visualize(arr, [], [], "Начинаем сортировку массива");
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      visualize(arr, [j, j + 1], [], 
        \`Сравниваем элементы: \${arr[j]} и \${arr[j + 1]}\`);
      
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        visualize(arr, [j, j + 1], [], 
          \`Меняем местами: \${arr[j + 1]} > \${arr[j]}\`);
      }
    }
    const sorted = Array.from({length: i + 1}, (_, k) => n - k - 1);
    visualize(arr, [], sorted, 
      \`Элемент \${arr[n - i - 1]} встал на своё место!\`);
  }
  visualize(arr, [], Array.from({length: n}, (_, i) => i), 
    "🎉 Массив полностью отсортирован!");
  return arr;
}`
  },
  "insertion-sort": {
    title: "Сортировка вставками",
    description: "Алгоритм построения отсортированного массива путем последовательной вставки элементов.",
    complexity: "O(n²)",
    defaultCode: `function insertionSort(arr, visualize) {
  visualize(arr, [], [0], "Первый элемент уже отсортирован");
  
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    visualize(arr, [i], Array.from({length: i}, (_, k) => k), 
      \`Вставляем элемент \${key}\`);
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      visualize(arr, [j, j + 1], [], 
        \`Сдвигаем \${arr[j]} вправо\`);
      j--;
    }
    arr[j + 1] = key;
    visualize(arr, [], Array.from({length: i + 1}, (_, k) => k), 
      \`Элемент \${key} вставлен на позицию \${j + 1}\`);
  }
  
  visualize(arr, [], Array.from({length: arr.length}, (_, i) => i), 
    "🎉 Массив отсортирован!");
  return arr;
}`
  },
  "selection-sort": {
    title: "Сортировка выбором",
    description: "Находит минимальный элемент и помещает его в начало неотсортированной части.",
    complexity: "O(n²)",
    defaultCode: `function selectionSort(arr, visualize) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    visualize(arr, [i], Array.from({length: i}, (_, k) => k), 
      \`Ищем минимум в неотсортированной части\`);
    
    for (let j = i + 1; j < arr.length; j++) {
      visualize(arr, [minIdx, j], [], 
        \`Сравниваем \${arr[minIdx]} и \${arr[j]}\`);
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      visualize(arr, [i, minIdx], [], 
        \`Меняем местами \${arr[minIdx]} и \${arr[i]}\`);
    }
    
    visualize(arr, [], Array.from({length: i + 1}, (_, k) => k), 
      \`Минимум \${arr[i]} на месте\`);
  }
  
  visualize(arr, [], Array.from({length: arr.length}, (_, i) => i), 
    "🎉 Массив отсортирован!");
  return arr;
}`
  },
  "binary-search": {
    title: "Бинарный поиск",
    description: "Эффективный алгоритм поиска в отсортированном массиве путем деления пополам.",
    complexity: "O(log n)",
    defaultCode: `function binarySearch(arr, target, visualize) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    visualize(arr, [mid], []);
    
    if (arr[mid] === target) {
      visualize(arr, [], [mid]);
      return mid;
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  visualize(arr, [], []);
  return -1;
}`
  }
};

type Step = {
  array: number[];
  comparing: number[];
  sorted: number[];
  description?: string;
};

const AlgorithmVisualization = () => {
  const { id } = useParams<{ id: string }>();
  const algorithm = id ? algorithms[id as keyof typeof algorithms] : null;
  
  const [code, setCode] = useState(algorithm?.defaultCode || "");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([500]);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showTheory, setShowTheory] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = steps[currentStepIndex] || {
    array: [64, 34, 25, 12, 22, 11, 90],
    comparing: [],
    sorted: [],
    description: "Начальное состояние массива"
  };

  useEffect(() => {
    if (algorithm) {
      setCode(algorithm.defaultCode);
    }
  }, [algorithm]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setIsPlaying(false);
            toast.success("Алгоритм завершен!");
            return steps.length - 1;
          }
          return next;
        });
      }, speed[0]);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const executeCode = () => {
    try {
      const newSteps: Step[] = [];
      const initialArray = [64, 34, 25, 12, 22, 11, 90];
      
      // Функция для записи шагов визуализации
      const visualize = (arr: number[], comparing: number[], sorted: number[], description?: string) => {
        newSteps.push({
          array: [...arr],
          comparing: [...comparing],
          sorted: [...sorted],
          description: description || ""
        });
      };

      // Выполняем код пользователя
      const func = new Function('arr', 'visualize', 'target', code + '\n; return typeof bubbleSort !== "undefined" ? bubbleSort(arr, visualize) : binarySearch(arr, 25, visualize);');
      
      const arrayCopy = [...initialArray];
      func(arrayCopy, visualize, 25);

      if (newSteps.length === 0) {
        toast.error("Код не создал шагов визуализации. Убедитесь, что вы вызываете функцию visualize()");
        return;
      }

      setSteps(newSteps);
      setCurrentStepIndex(0);
      toast.success("Код успешно выполнен!");
    } catch (error) {
      console.error("Error executing code:", error);
      toast.error(`Ошибка в коде: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    }
  };

  const stepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const reset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const maxValue = Math.max(...currentStep.array);

  if (!algorithm) {
    return <div>Алгоритм не найден</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/algorithms" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к каталогу
        </Link>

        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            {algorithm.title}
          </h1>
          <p className="text-muted-foreground text-lg mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {algorithm.description}
          </p>
          <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Временная сложность: <span className="text-primary font-mono">{algorithm.complexity}</span>
          </p>
          
          {/* Переключатель между теорией и практикой */}
          <div className="flex gap-4 mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button
              onClick={() => setShowTheory(true)}
              variant={showTheory ? "default" : "outline"}
              className={`${showTheory ? "gradient-primary" : ""} hover:scale-105 transition-transform`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Теория
            </Button>
            <Button
              onClick={() => setShowTheory(false)}
              variant={!showTheory ? "default" : "outline"}
              className={`${!showTheory ? "gradient-primary" : ""} hover:scale-105 transition-transform`}
              disabled={showTheory}
            >
              <Play className="w-4 h-4 mr-2" />
              Визуализация
            </Button>
          </div>
        </div>

        {showTheory ? (
          <TheorySection 
            algorithmId={id || ""} 
            onComplete={() => {
              setShowTheory(false);
              toast.success("Отлично! Теперь посмотрите визуализацию алгоритма");
            }} 
          />
        ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-border animate-scale-in hover:glow-primary transition-all">
              <CardHeader>
                <CardTitle className="animate-fade-in">Визуализация</CardTitle>
                <CardDescription className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  Шаг {currentStepIndex + 1} из {steps.length || 1}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Описание текущего шага */}
                <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-center text-lg font-medium text-primary">
                    {currentStep.description || "Наблюдайте за работой алгоритма"}
                  </p>
                </div>

                {/* Визуализация */}
                <div className="relative h-80 bg-gradient-to-b from-card-bg to-background rounded-lg p-6 border-2 border-border">
                  <div className="flex items-end justify-center gap-3 h-full">
                    {currentStep.array.map((value, index) => {
                      const isComparing = currentStep.comparing.includes(index);
                      const isSorted = currentStep.sorted.includes(index);
                      
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center justify-end gap-3 flex-1 relative group"
                        >
                          {/* Стрелка для сравниваемых элементов */}
                          {isComparing && (
                            <div className="absolute -top-8 animate-bounce">
                              <div className="text-2xl">👇</div>
                            </div>
                          )}
                          
                          {/* Блок с числом */}
                          <div
                            className={`
                              w-full rounded-lg flex items-center justify-center
                              font-bold text-2xl transition-all duration-500 relative
                              ${isComparing 
                                ? "bg-gradient-accent scale-110 shadow-[0_0_40px_rgba(236,72,153,0.6)] animate-pulse" 
                                : isSorted
                                ? "bg-gradient-to-br from-success to-success/80 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                : "bg-gradient-primary shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                              }
                            `}
                            style={{ 
                              height: `${(value / maxValue) * 100}%`,
                              minHeight: '60px'
                            }}
                          >
                            <span className="text-white drop-shadow-lg">{value}</span>
                            
                            {/* Эффект свечения */}
                            {isComparing && (
                              <div className="absolute inset-0 rounded-lg bg-accent/20 animate-pulse" />
                            )}
                          </div>
                          
                          {/* Индекс элемента */}
                          <span className="text-xs text-muted-foreground font-mono">
                            [{index}]
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      variant="default"
                      size="lg"
                      className="gradient-primary hover:opacity-90"
                      disabled={steps.length === 0 || currentStepIndex >= steps.length - 1}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button
                      onClick={stepBackward}
                      variant="outline"
                      size="lg"
                      disabled={isPlaying || currentStepIndex === 0}
                    >
                      <SkipForward className="w-5 h-5 rotate-180" />
                    </Button>
                    <Button
                      onClick={stepForward}
                      variant="outline"
                      size="lg"
                      disabled={isPlaying || currentStepIndex >= steps.length - 1}
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={reset}
                      variant="outline"
                      size="lg"
                      disabled={isPlaying}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Скорость: {speed[0]}ms
                    </label>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      min={100}
                      max={2000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Код алгоритма</CardTitle>
                  <Button
                    onClick={() => setShowCodeEditor(!showCodeEditor)}
                    variant="outline"
                    size="sm"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    {showCodeEditor ? "Скрыть редактор" : "Редактировать"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showCodeEditor ? (
                  <>
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="font-mono text-sm min-h-[400px] bg-code-bg text-code-text"
                      placeholder="Введите код алгоритма..."
                    />
                    <Button
                      onClick={executeCode}
                      className="w-full gradient-primary hover:opacity-90"
                    >
                      Запустить код
                    </Button>
                  </>
                ) : (
                  <pre className="bg-code-bg p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-code-text font-mono">{code}</code>
                  </pre>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle>Легенда</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-algo-active glow-primary" />
                  <span className="text-sm">Текущий элемент</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-algo-comparing glow-accent" />
                  <span className="text-sm">Сравнение</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-algo-sorted" />
                  <span className="text-sm">Отсортировано</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Как работает визуализация?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Функция <code className="text-primary">visualize(arr, comparing, sorted)</code> записывает шаги:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>arr</code> - текущий массив</li>
                  <li><code>comparing</code> - индексы сравниваемых элементов</li>
                  <li><code>sorted</code> - индексы отсортированных элементов</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmVisualization;