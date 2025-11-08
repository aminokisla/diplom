import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Play, CheckCircle, Code2, Brain, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div 
          className="absolute inset-0 opacity-20 animate-glow-pulse"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Интерактивное обучение</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Алгоритмы и структуры данных
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Изучайте программирование через визуализацию. Смотрите, как работают алгоритмы в реальном времени.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/algorithms">
                <Button size="lg" className="gradient-primary hover:opacity-90 glow-primary text-lg px-8 hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 mr-2" />
                  Начать обучение
                </Button>
              </Link>
              <Link to="/quiz">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2 hover:scale-105 transition-transform">
                  <Brain className="w-5 h-5 mr-2" />
                  Проверить знания
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Почему стоит выбрать нас?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Уникальная платформа для изучения алгоритмов с AI-помощником
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-border hover:border-primary transition-all hover:glow-primary hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 animate-float">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Визуализация</CardTitle>
                <CardDescription className="text-base">
                  Наблюдайте за работой алгоритмов в реальном времени. Пошаговое выполнение с подробными пояснениями.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border hover:border-primary transition-all hover:glow-primary hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 animate-float" style={{ animationDelay: '0.5s' }}>
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">AI-помощник</CardTitle>
                <CardDescription className="text-base">
                  Персональные объяснения на основе ваших ответов. AI адаптируется под ваш уровень понимания.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border hover:border-primary transition-all hover:glow-primary hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4 animate-float" style={{ animationDelay: '1s' }}>
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-2xl">Интерактивные тесты</CardTitle>
                <CardDescription className="text-base">
                  Проверяйте свои знания с мгновенной обратной связью и подробными объяснениями.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Looks Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Как это работает?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Посмотрите, как выглядит процесс обучения на нашей платформе
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            {/* Step 1: Theory */}
            <Card className="border-2 border-primary/30 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 w-fit">
                    <span className="text-2xl font-bold">1</span>
                    <span>Изучайте теорию</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Подробные конспекты с примерами</h3>
                  <p className="text-muted-foreground mb-4">
                    Каждый алгоритм сопровождается детальным объяснением с визуальными примерами. Вы узнаете не только "как", но и "почему" алгоритм работает именно так.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Пошаговое объяснение
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Визуальные схемы
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Реальные примеры
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                  <div className="bg-card rounded-lg p-6 shadow-2xl border-2 border-border max-w-sm w-full">
                    <div className="space-y-4">
                      <div className="h-3 bg-primary/30 rounded animate-pulse" />
                      <div className="h-3 bg-primary/20 rounded w-4/5 animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <div className="h-32 bg-gradient-primary/20 rounded flex items-center justify-center gap-2 mt-4">
                        {[64, 34, 25].map((num, i) => (
                          <div key={i} className="w-12 h-12 bg-gradient-primary rounded flex items-center justify-center text-white font-bold animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                            {num}
                          </div>
                        ))}
                      </div>
                      <div className="h-3 bg-primary/20 rounded w-3/5 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step 2: Questions */}
            <Card className="border-2 border-accent/30 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-accent/20 to-primary/20 p-8 flex items-center justify-center order-2 md:order-1">
                  <div className="bg-card rounded-lg p-6 shadow-2xl border-2 border-border max-w-sm w-full">
                    <div className="mb-4 font-bold text-lg">Вопрос для проверки</div>
                    <div className="space-y-3">
                      {['Вариант A', 'Вариант B', 'Вариант C'].map((opt, i) => (
                        <div key={i} className="p-3 border-2 border-border rounded-lg hover:border-primary transition-colors cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-accent/10 border-l-4 border-accent rounded text-sm animate-scale-in" style={{ animationDelay: '0.4s' }}>
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">AI объясняет ошибку...</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center order-1 md:order-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium mb-4 w-fit">
                    <span className="text-2xl font-bold">2</span>
                    <span>Проверяйте понимание</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Вопросы после каждого раздела</h3>
                  <p className="text-muted-foreground mb-4">
                    После каждого блока теории вас ждет вопрос для проверки понимания. Если ответ неверный, AI-помощник подробно объяснит ошибку и предложит похожий вопрос.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-accent" />
                      Персональные объяснения от AI
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-accent" />
                      Адаптивные вопросы
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-accent" />
                      Прогресс разблокируется постепенно
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Step 3: Visualization */}
            <Card className="border-2 border-success/30 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success font-medium mb-4 w-fit">
                    <span className="text-2xl font-bold">3</span>
                    <span>Смотрите визуализацию</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Интерактивная анимация алгоритма</h3>
                  <p className="text-muted-foreground mb-4">
                    После изучения теории откроется интерактивная визуализация. Вы сможете увидеть, как алгоритм работает шаг за шагом, управлять скоростью и даже изменить код.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-success" />
                      Пошаговое выполнение
                    </li>
                    <li className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-success" />
                      Контроль скорости
                    </li>
                    <li className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-success" />
                      Редактирование кода
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-success/20 to-primary/20 p-8 flex items-center justify-center">
                  <div className="bg-card rounded-lg p-6 shadow-2xl border-2 border-border max-w-sm w-full">
                    <div className="flex items-end justify-center gap-2 h-40 mb-4">
                      {[64, 34, 25, 12, 90].map((num, i) => {
                        const height = (num / 90) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                            <div 
                              className="w-full rounded bg-gradient-primary animate-scale-in"
                              style={{ 
                                height: `${height}%`,
                                animationDelay: `${i * 0.1}s`
                              }}
                            />
                            <span className="text-xs font-mono">[{i}]</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded bg-gradient-primary flex items-center justify-center animate-pulse">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 h-10 bg-border rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary bg-card/50 backdrop-blur glow-primary animate-scale-in hover:scale-105 transition-transform">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-6 animate-float" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                Готовы начать обучение?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Присоединяйтесь к тысячам студентов, которые уже изучают алгоритмы с нашей платформой
              </p>
              <Link to="/algorithms">
                <Button size="lg" className="gradient-primary hover:opacity-90 text-lg px-8 hover:scale-110 transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  Начать бесплатно
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;