import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, BookOpen, Lightbulb, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Question = {
  id: string;
  question: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation: string;
};

type TheoryBlock = {
  id: string;
  title: string;
  content: string | React.ReactNode;
  visualization?: React.ReactNode;
  question: Question;
};

type TheorySectionProps = {
  algorithmId: string;
  onComplete: () => void;
};

const theoryData: Record<string, TheoryBlock[]> = {
  "bubble-sort": [
    {
      id: "1",
      title: "Введение в сортировку пузырьком",
      content: (
        <div className="space-y-4">
          <p><strong>Сортировка пузырьком</strong> — это один из самых фундаментальных алгоритмов сортировки в информатике. Несмотря на свою простоту, он является отличной отправной точкой для понимания более сложных алгоритмов.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Что такое сортировка пузырьком?</h4>
          <p>Название "пузырьковая сортировка" происходит от способа, которым меньшие элементы "всплывают" в начало списка, подобно пузырькам воздуха в воде. Алгоритм работает путем многократного прохода по списку, сравнивая каждую пару соседних элементов и меняя их местами, если они находятся в неправильном порядке.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Основная идея:</h4>
          <p>Представьте, что у вас есть ряд чисел, и вы хотите расположить их от меньшего к большему. Вы начинаете с первых двух чисел, сравниваете их, и если первое больше второго, меняете их местами. Затем переходите к следующей паре и повторяете процесс. После первого прохода самое большое число окажется в конце массива - оно "всплыло" как пузырек.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Почему этот алгоритм важен?</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Образовательная ценность:</strong> Первый алгоритм сортировки, который изучают студенты. Он помогает понять базовые концепции: сравнение, обмен элементов, итерации.</li>
            <li><strong>Простота реализации:</strong> Код алгоритма легко написать и понять, что делает его идеальным для изучения основ программирования.</li>
            <li><strong>Основа для понимания:</strong> Понимание сортировки пузырьком облегчает изучение более эффективных алгоритмов.</li>
          </ul>
          
          <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary mt-6">
            <p className="font-semibold">Ключевые особенности:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>✅ Простота реализации и понимания</li>
              <li>✅ Работает "на месте" - не требует дополнительной памяти</li>
              <li>✅ Стабильный алгоритм - сохраняет относительный порядок равных элементов</li>
              <li>⚠️ Низкая эффективность на больших данных</li>
              <li>⚠️ Много избыточных сравнений</li>
            </ul>
          </div>
          
          <div className="bg-success/10 p-4 rounded-lg border-l-4 border-success mt-4">
            <p className="font-semibold">Где применяется:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>В образовательных целях для обучения основам алгоритмов</li>
              <li>Для сортировки небольших массивов (до 10-20 элементов)</li>
              <li>Когда важна простота кода, а не производительность</li>
              <li>В системах с ограниченной памятью (работает "на месте")</li>
            </ul>
          </div>
        </div>
      ),
      visualization: (
        <div className="bg-primary/10 p-8 rounded-lg border-2 border-primary/20 my-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white shadow-lg animate-scale-in">64</div>
              <span className="text-xs text-muted-foreground">индекс 0</span>
            </div>
            <div className="text-3xl text-primary animate-pulse">↔</div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white shadow-lg animate-scale-in" style={{ animationDelay: '0.1s' }}>34</div>
              <span className="text-xs text-muted-foreground">индекс 1</span>
            </div>
            <div className="text-2xl text-muted-foreground">→</div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white shadow-lg animate-scale-in" style={{ animationDelay: '0.2s' }}>25</div>
              <span className="text-xs text-muted-foreground">индекс 2</span>
            </div>
          </div>
          <p className="text-center text-muted-foreground">Сравниваем соседние элементы и меняем местами, если нужно</p>
        </div>
      ),
      question: {
        id: "q1",
        question: "Почему алгоритм называется 'сортировка пузырьком'?",
        options: [
          { id: "a", text: "Потому что он быстрый как пузырьки воздуха", correct: false },
          { id: "b", text: "Потому что элементы 'всплывают' на свои места, как пузырьки в воде", correct: true },
          { id: "c", text: "Потому что он создает пузыри в памяти", correct: false },
          { id: "d", text: "Потому что его изобрел человек по имени Бубль", correct: false },
        ],
        explanation: "Название отражает визуальное поведение алгоритма: элементы 'всплывают' на свои места, как пузырьки воздуха в воде."
      }
    },
    {
      id: "2",
      title: "История и происхождение алгоритма",
      content: (
        <div className="space-y-4">
          <p>Сортировка пузырьком имеет интересную историю развития в информатике.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Происхождение названия:</h4>
          <p>Термин "bubble sort" впервые появился в 1956 году. Название отражает визуальное поведение алгоритма: когда элементы меняются местами, большие значения постепенно "всплывают" к концу массива, подобно пузырькам воздуха, поднимающимся на поверхность воды.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Исторический контекст:</h4>
          <p>В ранние дни компьютерной науки (1950-1960-е годы) память была крайне дорогой и ограниченной. Сортировка пузырьком была популярна именно потому, что работает "на месте" - не требует выделения дополнительной памяти для временных массивов.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Критика Дональда Кнута:</h4>
          <p>Знаменитый компьютерный ученый Дональд Кнут в своей книге "Искусство программирования" критиковал чрезмерное использование сортировки пузырьком в обучении, называя ее "наихудшим алгоритмом сортировки". Несмотря на это, алгоритм остается важным образовательным инструментом.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Эволюция использования:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>1950-1960-е:</strong> Активно используется из-за ограничений памяти</li>
            <li><strong>1970-1980-е:</strong> Постепенно заменяется более эффективными алгоритмами</li>
            <li><strong>1990-е - настоящее время:</strong> Используется преимущественно в образовательных целях</li>
          </ul>
          
          <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent mt-6">
            <p className="font-semibold">Интересные факты:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>В некоторых языках программирования (например, в ранних версиях BASIC) сортировка пузырьком была встроенной функцией</li>
              <li>Алгоритм часто используется в технических собеседованиях для оценки базовых знаний кандидатов</li>
              <li>Существует более 10 вариаций базового алгоритма, включая "коктейльную сортировку" и "сортировку расческой"</li>
            </ul>
          </div>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Современное значение:</h4>
          <p>Хотя сортировка пузырьком редко используется в production-коде, она остается важной частью компьютерного образования. Понимание этого алгоритма помогает освоить базовые концепции программирования, понять разницу между простотой и эффективностью, и оценить важность выбора правильного алгоритма.</p>
        </div>
      ),
      visualization: (
        <div className="bg-accent/10 p-8 rounded-lg border-2 border-accent/20 my-6">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-float">📚</div>
            <div className="space-y-2">
              <p className="font-bold text-lg">Временная шкала</p>
              <div className="space-y-3 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="w-20 text-primary font-bold">1956</div>
                  <div className="flex-1 text-sm">Первое упоминание термина</div>
                </div>
                <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="w-20 text-primary font-bold">1960-е</div>
                  <div className="flex-1 text-sm">Активное использование</div>
                </div>
                <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="w-20 text-primary font-bold">1970-е</div>
                  <div className="flex-1 text-sm">Критика Кнута</div>
                </div>
                <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="w-20 text-primary font-bold">Сейчас</div>
                  <div className="flex-1 text-sm">Образовательный инструмент</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      question: {
        id: "q2",
        question: "Почему сортировка пузырьком была популярна в 1950-1960-х годах?",
        options: [
          { id: "a", text: "Она была самой быстрой", correct: false },
          { id: "b", text: "Она не требовала дополнительной памяти, которая была дорогой", correct: true },
          { id: "c", text: "Других алгоритмов не существовало", correct: false },
          { id: "d", text: "Она была изобретена в то время", correct: false },
        ],
        explanation: "В 1950-1960-х годах память была крайне дорогой. Сортировка пузырьком не требует дополнительной памяти, что было критически важно."
      }
    },
    {
      id: "3",
      title: "Принцип работы алгоритма",
      content: (
        <div className="space-y-4">
          <p>Давайте детально разберем, как работает сортировка пузырьком шаг за шагом.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Базовый принцип:</h4>
          <p>Алгоритм использует двойной цикл: внешний цикл отвечает за количество проходов по массиву, а внутренний - за сравнение и обмен соседних элементов.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Пошаговое описание работы:</h4>
          
          <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary mt-4">
            <p className="font-semibold">Шаг 1: Первый проход</p>
            <p className="mt-2">Мы начинаем с первого элемента и сравниваем его со вторым. Если первый больше второго, меняем их местами. Затем переходим ко второму элементу, сравниваем его с третьим, и так далее до конца массива.</p>
            <p className="mt-2">Пример: [5, 2, 8, 1, 9]</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
              <li>Сравниваем 5 и 2 → меняем → [2, 5, 8, 1, 9]</li>
              <li>Сравниваем 5 и 8 → не меняем → [2, 5, 8, 1, 9]</li>
              <li>Сравниваем 8 и 1 → меняем → [2, 5, 1, 8, 9]</li>
              <li>Сравниваем 8 и 9 → не меняем → [2, 5, 1, 8, 9]</li>
            </ul>
            <p className="mt-2 text-success font-semibold">Результат: самый большой элемент (9) гарантированно оказался в конце.</p>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent mt-4">
            <p className="font-semibold">Шаг 2: Второй проход</p>
            <p className="mt-2">Повторяем процесс, но уже не смотрим на последний элемент - он уже на своем месте.</p>
            <p className="mt-2">[2, 5, 1, 8, 9]</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
              <li>Сравниваем 2 и 5 → не меняем</li>
              <li>Сравниваем 5 и 1 → меняем → [2, 1, 5, 8, 9]</li>
              <li>Сравниваем 5 и 8 → не меняем</li>
            </ul>
            <p className="mt-2 text-success font-semibold">Результат: второй по величине элемент (8) на месте.</p>
          </div>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Важные детали реализации:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Количество проходов:</strong> Для массива из n элементов требуется максимум n-1 проход</li>
            <li><strong>Количество сравнений:</strong> В худшем случае: (n-1) + (n-2) + ... + 1 = n(n-1)/2 сравнений</li>
            <li><strong>Оптимизация:</strong> Если за полный проход не было ни одного обмена, массив уже отсортирован - можно остановиться</li>
          </ul>
          
          <div className="bg-success/10 p-4 rounded-lg border-l-4 border-success mt-6">
            <p className="font-semibold">Инвариант алгоритма:</p>
            <p className="mt-2">После i-го прохода последние i элементов гарантированно находятся на своих окончательных позициях в отсортированном порядке.</p>
          </div>
        </div>
      ),
      visualization: (
        <div className="bg-success/10 p-8 rounded-lg border-2 border-success/20 my-6">
          <div className="space-y-6">
            <div className="text-center font-bold text-lg mb-4">Пример работы алгоритма</div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 animate-fade-in-up">
                <div className="w-24 text-sm text-muted-foreground">Начало:</div>
                <div className="flex gap-2">
                  {[5, 2, 8, 1, 9].map((num, i) => (
                    <div key={i} className="w-12 h-12 rounded bg-gradient-primary flex items-center justify-center text-white font-bold shadow-md animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="w-24 text-sm text-muted-foreground">Проход 1:</div>
                <div className="flex gap-2">
                  {[2, 5, 1, 8, 9].map((num, i) => (
                    <div key={i} className={`w-12 h-12 rounded flex items-center justify-center text-white font-bold shadow-md ${i === 4 ? 'bg-gradient-to-br from-success to-success/80' : 'bg-gradient-primary'}`}>
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="w-24 text-sm text-muted-foreground">Проход 2:</div>
                <div className="flex gap-2">
                  {[2, 1, 5, 8, 9].map((num, i) => (
                    <div key={i} className={`w-12 h-12 rounded flex items-center justify-center text-white font-bold shadow-md ${i >= 3 ? 'bg-gradient-to-br from-success to-success/80' : 'bg-gradient-primary'}`}>
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                <div className="w-24 text-sm text-muted-foreground">Результат:</div>
                <div className="flex gap-2">
                  {[1, 2, 5, 8, 9].map((num, i) => (
                    <div key={i} className="w-12 h-12 rounded bg-gradient-to-br from-success to-success/80 flex items-center justify-center text-white font-bold shadow-md">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      question: {
        id: "q3",
        question: "Сколько проходов требуется для сортировки массива из 5 элементов в худшем случае?",
        options: [
          { id: "a", text: "3 прохода", correct: false },
          { id: "b", text: "4 прохода", correct: true },
          { id: "c", text: "5 проходов", correct: false },
          { id: "d", text: "10 проходов", correct: false },
        ],
        explanation: "Для массива из n элементов требуется n-1 проход. Для 5 элементов нужно 4 прохода."
      }
    },
    {
      id: "4",
      title: "Детальный разбор проходов",
      content: (
        <div className="space-y-4">
          <p>Рассмотрим подробно, что происходит на каждом этапе работы алгоритма.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Анатомия одного прохода:</h4>
          <p>Один проход по массиву состоит из серии сравнений и потенциальных обменов. Давайте проследим за массивом [64, 34, 25, 12, 22, 11, 90] через весь процесс сортировки.</p>
          
          <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary mt-4">
            <p className="font-semibold">ПРОХОД 1: Находим максимум</p>
            <p className="text-sm mt-2">Начальное состояние: [64, 34, 25, 12, 22, 11, 90]</p>
            <ul className="list-none space-y-1 ml-4 mt-2 text-sm">
              <li>Сравнение 1: 64 {`>`} 34? Да → Меняем → [34, 64, 25, 12, 22, 11, 90]</li>
              <li>Сравнение 2: 64 {`>`} 25? Да → Меняем → [34, 25, 64, 12, 22, 11, 90]</li>
              <li>Сравнение 3: 64 {`>`} 12? Да → Меняем → [34, 25, 12, 64, 22, 11, 90]</li>
              <li>Сравнение 4: 64 {`>`} 22? Да → Меняем → [34, 25, 12, 22, 64, 11, 90]</li>
              <li>Сравнение 5: 64 {`>`} 11? Да → Меняем → [34, 25, 12, 22, 11, 64, 90]</li>
              <li>Сравнение 6: 64 {`>`} 90? Нет → Не меняем → [34, 25, 12, 22, 11, 64, 90]</li>
            </ul>
            <p className="text-success font-semibold mt-2">Итог прохода: 90 встало на своё место (последняя позиция)</p>
            <p className="text-sm text-muted-foreground">Количество сравнений: 6 | Количество обменов: 5</p>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent mt-4">
            <p className="font-semibold">ПРОХОД 2: Находим следующий максимум</p>
            <p className="text-sm mt-2">Начальное состояние: [34, 25, 12, 22, 11, 64, 90] (90 уже на месте)</p>
            <ul className="list-none space-y-1 ml-4 mt-2 text-sm">
              <li>Сравнение 1: 34 {`>`} 25? Да → Меняем → [25, 34, 12, 22, 11, 64, 90]</li>
              <li>Сравнение 2: 34 {`>`} 12? Да → Меняем → [25, 12, 34, 22, 11, 64, 90]</li>
              <li>Сравнение 3: 34 {`>`} 22? Да → Меняем → [25, 12, 22, 34, 11, 64, 90]</li>
              <li>Сравнение 4: 34 {`>`} 11? Да → Меняем → [25, 12, 22, 11, 34, 64, 90]</li>
              <li>Сравнение 5: 34 {`>`} 64? Нет → Не меняем → [25, 12, 22, 11, 34, 64, 90]</li>
            </ul>
            <p className="text-success font-semibold mt-2">Итог прохода: 64 встало на своё место</p>
            <p className="text-sm text-muted-foreground">Количество сравнений: 5 | Количество обменов: 4</p>
          </div>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Важные наблюдения:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Уменьшение работы:</strong> Каждый следующий проход выполняет на одно сравнение меньше</li>
            <li><strong>Гарантия прогресса:</strong> После каждого прохода хотя бы один элемент на месте</li>
            <li><strong>Худший случай:</strong> Обратно отсортированный массив требует максимум обменов</li>
            <li><strong>Лучший случай:</strong> Уже отсортированный массив - только сравнения, без обменов</li>
          </ul>
          
          <div className="bg-success/10 p-4 rounded-lg border-l-4 border-success mt-6">
            <p className="font-semibold">Оптимизация с флагом:</p>
            <p className="mt-2">Можно добавить флаг для отслеживания обменов. Если за проход не было ни одного обмена - массив отсортирован, можно остановиться досрочно.</p>
            <p className="mt-2">Пример: [1, 2, 3, 5, 4] → После одного прохода: [1, 2, 3, 4, 5] → Второй проход: ни одного обмена → СТОП</p>
            <p className="mt-2 text-primary">Это снижает лучший случай до O(n) вместо O(n²).</p>
          </div>
        </div>
      ),
      visualization: (
        <div className="bg-primary/10 p-8 rounded-lg border-2 border-primary/20 my-6 space-y-4">
          <div className="text-center font-bold mb-4">Количество операций</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-card p-4 rounded-lg border animate-scale-in">
              <div className="text-center mb-2 font-semibold text-primary">Проход 1</div>
              <div className="space-y-1 text-xs">
                <div>Сравнений: 6</div>
                <div>Обменов: 5</div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-center mb-2 font-semibold text-primary">Проход 2</div>
              <div className="space-y-1 text-xs">
                <div>Сравнений: 5</div>
                <div>Обменов: 4</div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-2 font-semibold text-primary">Проход 3</div>
              <div className="space-y-1 text-xs">
                <div>Сравнений: 4</div>
                <div>Обменов: 3</div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center mb-2 font-semibold text-success">Итого</div>
              <div className="space-y-1 text-xs">
                <div>Всего: 15 операций</div>
                <div>Формула: n(n-1)/2</div>
              </div>
            </div>
          </div>
        </div>
      ),
      question: {
        id: "q4",
        question: "Что происходит после каждого полного прохода по массиву?",
        options: [
          { id: "a", text: "Первый элемент встает на свое место", correct: false },
          { id: "b", text: "Все элементы частично сортируются", correct: false },
          { id: "c", text: "Самый большой из неотсортированных элементов встает на свое место справа", correct: true },
          { id: "d", text: "Происходит перемешивание элементов", correct: false },
        ],
        explanation: "После каждого прохода самый большой элемент из оставшихся неотсортированных гарантированно встает в конец массива."
      }
    },
    {
      id: "5",
      title: "Временная сложность O(n²)",
      content: (
        <div className="space-y-4">
          <p>Анализ эффективности - ключевой навык при работе с алгоритмами. Разберем производительность сортировки пузырьком во всех деталях.</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Что такое временная сложность?</h4>
          <p>Временная сложность показывает, как растет время выполнения алгоритма при увеличении размера входных данных. Измеряется в нотации "большого О" (Big O notation).</p>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Анализ для сортировки пузырьком:</h4>
          
          <div className="bg-destructive/10 p-4 rounded-lg border-l-4 border-destructive mt-4">
            <p className="font-semibold text-destructive">1. Худший случай: O(n²)</p>
            <p className="mt-2">Худший случай - когда массив отсортирован в обратном порядке. Пример: [9, 8, 7, 6, 5, 4, 3, 2, 1]</p>
            <p className="mt-2 font-semibold">Почему O(n²)?</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
              <li>Внешний цикл выполняется n-1 раз</li>
              <li>Внутренний цикл на i-й итерации выполняется n-i раз</li>
              <li>Всего операций: (n-1) + (n-2) + ... + 1 = n(n-1)/2 ≈ n²/2</li>
            </ul>
            <p className="mt-2">Для массива из 100 элементов: 100 × 99 / 2 = 4,950 сравнений + примерно 4,950 обменов</p>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent mt-4">
            <p className="font-semibold text-accent">2. Средний случай: O(n²)</p>
            <p className="mt-2">В случайно перемешанном массиве в среднем потребуется примерно n²/4 обменов, но это все равно O(n²).</p>
          </div>
          
          <div className="bg-success/10 p-4 rounded-lg border-l-4 border-success mt-4">
            <p className="font-semibold text-success">3. Лучший случай: O(n)</p>
            <p className="mt-2">С оптимизацией (флагом проверки обменов) для уже отсортированного массива:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
              <li>Один проход: n-1 сравнений</li>
              <li>Ни одного обмена → СТОП</li>
              <li>Итого: O(n)</li>
            </ul>
            <p className="mt-2 text-destructive">Без оптимизации: O(n²) даже для отсортированного массива!</p>
          </div>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Практические выводы:</h4>
          <div className="bg-card p-4 rounded-lg border mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Размер (n)</th>
                  <th className="text-right py-2">Операций</th>
                  <th className="text-right py-2">Время*</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">10</td>
                  <td className="text-right">100</td>
                  <td className="text-right text-success">{`<`}0.001с</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">100</td>
                  <td className="text-right">10,000</td>
                  <td className="text-right text-success">~0.01с</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">1,000</td>
                  <td className="text-right">1,000,000</td>
                  <td className="text-right text-accent">~0.1с</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">10,000</td>
                  <td className="text-right">100,000,000</td>
                  <td className="text-right text-destructive">~10с</td>
                </tr>
                <tr>
                  <td className="py-2">100,000</td>
                  <td className="text-right">10,000,000,000</td>
                  <td className="text-right text-destructive">~16 минут</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">* Примерное время на современном компьютере</p>
          </div>
          
          <div className="bg-destructive/10 p-4 rounded-lg border-l-4 border-destructive mt-6">
            <p className="font-semibold">Почему не используем пузырьковую сортировку в production:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li><strong>Квадратичная сложность:</strong> Растет слишком быстро</li>
              <li><strong>Много избыточных сравнений:</strong> Проверяет уже отсортированные элементы</li>
              <li><strong>Неэффективное использование кэша:</strong> Постоянные обмены соседних элементов</li>
            </ul>
          </div>
        </div>
      ),
      visualization: (
        <div className="bg-accent/10 p-8 rounded-lg border-2 border-accent/20 my-6 space-y-6">
          <div className="text-center font-bold text-lg mb-4">Рост времени выполнения</div>
          <div className="space-y-3">
            {[
              { n: 10, ops: 100, time: "< 0.001с", percent: 10 },
              { n: 100, ops: 10000, time: "0.01с", percent: 30 },
              { n: 1000, ops: 1000000, time: "0.1с", percent: 60 },
              { n: 10000, ops: 100000000, time: "10с", percent: 100 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-card p-3 rounded-lg animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-24 text-sm font-mono text-primary">n = {item.n}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gradient-primary rounded-full transition-all" style={{ width: `${item.percent}%` }} />
                </div>
                <div className="w-32 text-sm text-right text-muted-foreground">{item.time}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Видно экспоненциальный рост времени выполнения
          </div>
        </div>
      ),
      question: {
        id: "q5",
        question: "Какова временная сложность сортировки пузырьком в худшем случае?",
        options: [
          { id: "a", text: "O(n)", correct: false },
          { id: "b", text: "O(n log n)", correct: false },
          { id: "c", text: "O(n²)", correct: true },
          { id: "d", text: "O(2ⁿ)", correct: false },
        ],
        explanation: "Сортировка пузырьком имеет два вложенных цикла, что дает квадратичную временную сложность O(n²) в худшем случае."
      }
    },
    {
      id: "6",
      title: "Практическое применение",
      content: (
        <div className="space-y-4">
          <p>Теперь, когда мы понимаем, как работает сортировка пузырьком, давайте обсудим, когда её использовать и чем заменить.</p>
          
          <div className="bg-success/10 p-4 rounded-lg border-l-4 border-success mt-6">
            <p className="font-semibold text-success">Когда МОЖНО использовать пузырьковую сортировку:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li><strong>Образовательные проекты</strong> - изучение основ алгоритмов</li>
              <li><strong>Очень маленькие массивы (n {`<`} 10-20)</strong> - разница с O(n log n) незаметна</li>
              <li><strong>Почти отсортированные данные</strong> (с оптимизацией) - может работать за O(n)</li>
              <li><strong>Ограниченная память</strong> - работает "на месте", O(1) дополнительной памяти</li>
            </ul>
          </div>
          
          <div className="bg-destructive/10 p-4 rounded-lg border-l-4 border-destructive mt-4">
            <p className="font-semibold text-destructive">Когда НЕЛЬЗЯ использовать:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>❌ Большие массивы (n {`>`} 100)</li>
              <li>❌ Критичные по времени операции</li>
              <li>❌ Случайные данные</li>
              <li>❌ Production-код (почти всегда)</li>
            </ul>
          </div>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Альтернативные алгоритмы:</h4>
          <div className="bg-card p-4 rounded-lg border mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Алгоритм</th>
                  <th className="text-center py-2">Сложность</th>
                  <th className="text-left py-2">Когда лучше</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b">
                  <td className="py-2">Быстрая сортировка</td>
                  <td className="text-center">O(n log n)</td>
                  <td>Большие массивы, общего назначения</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Сортировка слиянием</td>
                  <td className="text-center">O(n log n)</td>
                  <td>Гарантированная производительность</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Сортировка вставками</td>
                  <td className="text-center">O(n²)</td>
                  <td>Маленькие/почти отсортированные</td>
                </tr>
                <tr>
                  <td className="py-2">Array.sort() (JS)</td>
                  <td className="text-center">O(n log n)</td>
                  <td>Почти всегда - оптимизирована</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h4 className="text-lg font-semibold text-primary mt-6">Важные уроки:</h4>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Простота ≠ Эффективность:</strong> Простой код не всегда быстрый код</li>
            <li><strong>Выбор алгоритма важен:</strong> Разница между O(n²) и O(n log n) огромна</li>
            <li><strong>Контекст решает:</strong> Нет "лучшего" алгоритма для всех случаев</li>
            <li><strong>Используйте проверенные решения:</strong> Встроенные функции часто оптимальны</li>
          </ul>
          
          <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary mt-6">
            <p className="font-semibold">Заключение:</p>
            <p className="mt-2">Сортировка пузырьком - отличный образовательный инструмент, но редко применяется в реальных проектах. Понимание этого алгоритма дает фундамент для освоения более эффективных методов сортировки и анализа алгоритмов в целом.</p>
          </div>
        </div>
      ),
      visualization: (
        <div className="bg-success/10 p-8 rounded-lg border-2 border-success/20 my-6 space-y-4">
          <div className="text-center font-bold text-lg mb-4">Сравнение алгоритмов</div>
          <div className="space-y-3 text-sm">
            <div className="bg-card p-4 rounded-lg border-2 border-primary/50 animate-fade-in-up">
              <div className="font-semibold mb-2 text-primary">🟣 Пузырьковая O(n²)</div>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>✅ Простая реализация</div>
                <div>✅ Работает "на месте"</div>
                <div>❌ Очень медленная на больших данных</div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border-2 border-success/50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="font-semibold mb-2 text-success">🟢 Быстрая O(n log n)</div>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>✅ Быстрая в среднем</div>
                <div>✅ Работает "на месте"</div>
                <div>⚠️ O(n²) в худшем случае</div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border-2 border-accent/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="font-semibold mb-2 text-accent">🔵 Слиянием O(n log n)</div>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>✅ Стабильная производительность</div>
                <div>✅ Предсказуемая</div>
                <div>❌ Требует дополнительную память</div>
              </div>
            </div>
          </div>
        </div>
      ),
      question: {
        id: "q6",
        question: "В каком случае сортировка пузырьком может быть приемлемым выбором?",
        options: [
          { id: "a", text: "Для сортировки миллиона записей в базе данных", correct: false },
          { id: "b", text: "Для сортировки результатов поиска на сайте", correct: false },
          { id: "c", text: "Для сортировки 5 выбранных пользователем элементов", correct: true },
          { id: "d", text: "Для сортировки файлов на жестком диске", correct: false },
        ],
        explanation: "Для очень маленьких массивов (5-10 элементов) сортировка пузырьком вполне приемлема, так как разница в производительности незаметна, а код простой и понятный."
      }
    }
  ]
};

export const TheorySection = ({ algorithmId, onComplete }: TheorySectionProps) => {
  const blocks = theoryData[algorithmId] || [];
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [questionStates, setQuestionStates] = useState<Record<string, {
    selectedAnswer: string;
    isSubmitted: boolean;
    isCorrect: boolean;
    aiExplanation: string;
    isLoadingAI: boolean;
    pendingQuestion: Question | null;
  }>>({});
  
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const initQuestionState = (blockId: string) => {
    if (!questionStates[blockId]) {
      setQuestionStates(prev => ({
        ...prev,
        [blockId]: {
          selectedAnswer: "",
          isSubmitted: false,
          isCorrect: false,
          aiExplanation: "",
          isLoadingAI: false,
          pendingQuestion: null
        }
      }));
    }
  };

  const handleSubmit = async (block: TheoryBlock) => {
    initQuestionState(block.id);
    const state = questionStates[block.id];
    
    if (!state?.selectedAnswer) {
      toast.error("Пожалуйста, выберите ответ");
      return;
    }

    const question = state.pendingQuestion || block.question;
    const correct = question.options.find(opt => opt.id === state.selectedAnswer)?.correct || false;

    setQuestionStates(prev => ({
      ...prev,
      [block.id]: {
        ...prev[block.id],
        isSubmitted: true,
        isCorrect: correct
      }
    }));

    if (correct) {
      setCompletedBlocks(prev => new Set([...prev, block.id]));
      toast.success("Правильно! Следующий раздел разблокирован");
      
      // Прокрутка к следующему блоку
      const currentIndex = blocks.findIndex(b => b.id === block.id);
      if (currentIndex < blocks.length - 1) {
        const nextBlock = blocks[currentIndex + 1];
        setTimeout(() => {
          blockRefs.current[nextBlock.id]?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 500);
      } else {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } else {
      // Получаем объяснение от AI
      setQuestionStates(prev => ({
        ...prev,
        [block.id]: { ...prev[block.id], isLoadingAI: true }
      }));

      try {
        const { data, error } = await supabase.functions.invoke("quiz-ai-helper", {
          body: {
            question: question.question,
            userAnswer: question.options.find(opt => opt.id === state.selectedAnswer)?.text,
            correctAnswer: question.options.find(opt => opt.correct)?.text,
            explanation: question.explanation,
            attemptCount: 0
          }
        });

        if (error) throw error;

        setQuestionStates(prev => ({
          ...prev,
          [block.id]: {
            ...prev[block.id],
            aiExplanation: data.explanation,
            pendingQuestion: data.newQuestion ? {
              id: `${question.id}_retry`,
              question: data.newQuestion.question,
              options: data.newQuestion.options,
              explanation: question.explanation
            } : null,
            isLoadingAI: false
          }
        }));
      } catch (error) {
        console.error("Error getting AI explanation:", error);
        toast.error("Не удалось получить объяснение от AI");
        setQuestionStates(prev => ({
          ...prev,
          [block.id]: {
            ...prev[block.id],
            aiExplanation: question.explanation,
            isLoadingAI: false
          }
        }));
      }
    }
  };

  const handleRetry = (blockId: string) => {
    const state = questionStates[blockId];
    if (state?.pendingQuestion) {
      // Применяем новый вопрос
      setQuestionStates(prev => ({
        ...prev,
        [blockId]: {
          selectedAnswer: "",
          isSubmitted: false,
          isCorrect: false,
          aiExplanation: "",
          isLoadingAI: false,
          pendingQuestion: null
        }
      }));
      
      // Обновляем вопрос в блоке (сохраняем как новый оригинальный)
      const blockIndex = blocks.findIndex(b => b.id === blockId);
      if (blockIndex !== -1) {
        blocks[blockIndex].question = state.pendingQuestion;
      }
    } else {
      setQuestionStates(prev => ({
        ...prev,
        [blockId]: {
          ...prev[blockId],
          selectedAnswer: "",
          isSubmitted: false,
          aiExplanation: ""
        }
      }));
    }
  };

  const isBlockUnlocked = (index: number) => {
    if (index === 0) return true;
    const previousBlock = blocks[index - 1];
    return completedBlocks.has(previousBlock.id);
  };

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        const unlocked = isBlockUnlocked(index);
        const state = questionStates[block.id] || {
          selectedAnswer: "",
          isSubmitted: false,
          isCorrect: false,
          aiExplanation: "",
          isLoadingAI: false,
          pendingQuestion: null
        };
        
        initQuestionState(block.id);
        
        const currentQuestion = state.pendingQuestion && !state.isSubmitted ? state.pendingQuestion : block.question;

        return (
          <div 
            key={block.id} 
            ref={el => blockRefs.current[block.id] = el}
            className={`transition-all duration-500 ${!unlocked ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {/* Теоретический блок */}
            <Card className={`border-2 ${unlocked ? 'border-primary/20 animate-fade-in-up' : 'border-border'} relative transition-all hover:glow-primary`} style={{ animationDelay: `${index * 0.1}s` }}>
              {!unlocked && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10 animate-fade-in">
                  <div className="text-center">
                    <Lock className="w-12 h-12 mx-auto mb-2 text-muted-foreground animate-pulse" />
                    <p className="text-muted-foreground">Ответьте на предыдущий вопрос</p>
                  </div>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    Раздел {index + 1} из {blocks.length}
                  </span>
                  {completedBlocks.has(block.id) && (
                    <CheckCircle className="w-5 h-5 text-success ml-auto animate-scale-in" />
                  )}
                </div>
                <CardTitle className="text-2xl">{block.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-base leading-relaxed">{block.content}</div>
                {block.visualization && (
                  <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    {block.visualization}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Вопрос */}
            {unlocked && !completedBlocks.has(block.id) && (
              <Card className="border-2 border-border mt-4 animate-fade-in hover:border-primary transition-all" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary animate-pulse" />
                    <CardTitle>Проверьте понимание</CardTitle>
                  </div>
                  {state.pendingQuestion && !state.isSubmitted && (
                    <CardDescription className="text-primary animate-fade-in">
                      Новый вопрос для закрепления материала
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg font-medium">{currentQuestion.question}</p>

                  <RadioGroup 
                    value={state.selectedAnswer} 
                    onValueChange={(value) => {
                      setQuestionStates(prev => ({
                        ...prev,
                        [block.id]: { ...prev[block.id], selectedAnswer: value }
                      }));
                    }}
                    disabled={state.isSubmitted}
                  >
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-smooth ${
                            state.isSubmitted && option.correct
                              ? "border-success bg-success/10"
                              : state.isSubmitted && state.selectedAnswer === option.id && !option.correct
                              ? "border-destructive bg-destructive/10"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          <RadioGroupItem value={option.id} id={`${block.id}-${option.id}`} />
                          <Label htmlFor={`${block.id}-${option.id}`} className="flex-1 cursor-pointer text-base">
                            {option.text}
                          </Label>
                          {state.isSubmitted && option.correct && (
                            <CheckCircle className="w-5 h-5 text-success" />
                          )}
                          {state.isSubmitted && state.selectedAnswer === option.id && !option.correct && (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {state.isSubmitted && !state.isCorrect && (
                    <Card className="border-2 border-primary bg-primary/5 animate-scale-in">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Lightbulb className="w-5 h-5 animate-pulse" />
                          AI-помощник объясняет:
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {state.isLoadingAI ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Генерирую персональное объяснение и новый вопрос...
                          </div>
                        ) : (
                          <p className="text-foreground leading-relaxed animate-fade-in">{state.aiExplanation}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-4">
                    {!state.isSubmitted ? (
                      <Button
                        onClick={() => handleSubmit(block)}
                        className="flex-1 gradient-primary hover:opacity-90"
                        size="lg"
                      >
                        Проверить ответ
                      </Button>
                    ) : !state.isCorrect ? (
                      <Button
                        onClick={() => handleRetry(block.id)}
                        className="flex-1 gradient-primary hover:opacity-90"
                        size="lg"
                        disabled={state.isLoadingAI}
                      >
                        {state.pendingQuestion ? "Ответить на новый вопрос" : "Попробовать снова"}
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );
};