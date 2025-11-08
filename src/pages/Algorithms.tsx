import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, TrendingUp } from "lucide-react";

const algorithms = [
  {
    id: "bubble-sort",
    title: "Сортировка пузырьком",
    description: "Простой алгоритм сортировки, который многократно проходит по списку, сравнивает соседние элементы и меняет их местами.",
    complexity: "O(n²)",
    difficulty: "Легкий",
    category: "Сортировка"
  },
  {
    id: "insertion-sort",
    title: "Сортировка вставками",
    description: "Алгоритм построения отсортированного массива путем последовательной вставки элементов на правильные позиции.",
    complexity: "O(n²)",
    difficulty: "Легкий",
    category: "Сортировка"
  },
  {
    id: "selection-sort",
    title: "Сортировка выбором",
    description: "Алгоритм сортировки, который находит минимальный элемент и помещает его в начало неотсортированной части.",
    complexity: "O(n²)",
    difficulty: "Легкий",
    category: "Сортировка"
  },
  {
    id: "merge-sort",
    title: "Сортировка слиянием",
    description: "Эффективный алгоритм сортировки, использующий принцип 'разделяй и властвуй' для слияния отсортированных подмассивов.",
    complexity: "O(n log n)",
    difficulty: "Средний",
    category: "Сортировка"
  },
  {
    id: "quick-sort",
    title: "Быстрая сортировка",
    description: "Один из самых эффективных алгоритмов сортировки, использующий разделение массива относительно опорного элемента.",
    complexity: "O(n log n)",
    difficulty: "Средний",
    category: "Сортировка"
  },
  {
    id: "binary-search",
    title: "Бинарный поиск",
    description: "Эффективный алгоритм поиска элемента в отсортированном массиве путем многократного деления пополам.",
    complexity: "O(log n)",
    difficulty: "Легкий",
    category: "Поиск"
  },
  {
    id: "linear-search",
    title: "Линейный поиск",
    description: "Простейший алгоритм поиска, последовательно проверяющий каждый элемент массива до нахождения искомого.",
    complexity: "O(n)",
    difficulty: "Легкий",
    category: "Поиск"
  },
  {
    id: "depth-first-search",
    title: "Поиск в глубину (DFS)",
    description: "Алгоритм обхода графа, который исследует как можно дальше по каждой ветви перед возвратом.",
    complexity: "O(V + E)",
    difficulty: "Средний",
    category: "Графы"
  },
  {
    id: "breadth-first-search",
    title: "Поиск в ширину (BFS)",
    description: "Алгоритм обхода графа, который исследует все вершины на текущем уровне перед переходом к следующему.",
    complexity: "O(V + E)",
    difficulty: "Средний",
    category: "Графы"
  },
  {
    id: "dijkstra",
    title: "Алгоритм Дейкстры",
    description: "Находит кратчайший путь от начальной вершины до всех остальных в графе с неотрицательными весами.",
    complexity: "O((V + E) log V)",
    difficulty: "Сложный",
    category: "Графы"
  }
];

const Algorithms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад на главную
        </Link>

        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Каталог алгоритмов
          </h1>
          <p className="text-muted-foreground text-lg">
            Изучайте алгоритмы с интерактивной визуализацией
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algo, index) => (
            <Link key={algo.id} to={`/algorithm/${algo.id}`}>
              <Card 
                className="h-full border-2 border-border hover:border-primary transition-all hover:glow-primary cursor-pointer group hover:scale-105 animate-fade-in-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {algo.category}
                    </Badge>
                    <Badge variant="secondary">{algo.difficulty}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-smooth">
                    {algo.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {algo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{algo.complexity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Сложность</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Algorithms;