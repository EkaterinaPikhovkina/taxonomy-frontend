import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CirclePackingDiagram = ({ data, width = 600, height = 600 }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            // Очищаем SVG если данных нет
            d3.select(svgRef.current).selectAll("*").remove();
            return;
        };

        // D3 ожидает один корневой узел. Создадим искусственный, если у нас массив.
        // Важно: D3 по умолчанию ищет поле 'value' для размера круга и 'children'.
        // Наша структура данных использует 'title' и 'children'.
        // Мы будем использовать .sum() для вычисления значения на основе количества потомков.
        const rootData = {
            title: "Taxonomy", // Имя для корневого элемента
            children: data
        };

        // Создаем иерархию D3
        const root = d3.hierarchy(rootData, d => d.children) // Указываем, как получить дочерние элементы
            .sum(d => !d.children || d.children.length === 0 ? 1 : 0) // Задаем "ценность" каждому листу = 1, родителям = 0 (их ценность будет суммой детей)
            .sort((a, b) => b.value - a.value); // Сортируем для красивой укладки

        // Создаем упаковщик кругов (pack layout)
        const pack = d3.pack()
            .size([width - 2, height - 2]) // -2 для небольшого отступа
            .padding(3); // Отступ между кругами

        // Применяем layout к данным
        const packedRoot = pack(root);

        const svg = d3.select(svgRef.current)
            .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`) // Центрируем изображение
            .attr('width', width)
            .attr('height', height)
            .attr('style', 'max-width: 100%; height: auto; display: block; margin: 0 auto; background: #f9f9f9; cursor: pointer;')
            .on("click", (event) => zoom(event, packedRoot)); // Добавляем зум по клику

        // Очищаем предыдущую отрисовку
        svg.selectAll("*").remove();

        // Цветовая схема
        const color = d3.scaleLinear()
            .domain([0, 5]) // Глубина вложенности
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"]) // Цветовой диапазон
            .interpolate(d3.interpolateHcl);

        // Создаем узлы (круги и текст)
        const node = svg.append("g")
            .selectAll("g")
            .data(packedRoot.descendants().slice(1)) // Берем все узлы, кроме самого корневого (нашего искусственного)
            .join("g")
            .attr("transform", d => `translate(${d.x},${d.y})`);

        node.append("circle")
            .attr("r", d => d.r)
            .attr("fill", d => d.children ? color(d.depth) : "#eee") // Цвет для узлов с детьми и для листьев
            .attr("stroke", d => d.children ? color(d.depth) : "#ccc")
            .on("mouseover", function () { d3.select(this).attr("stroke", "#000"); })
            .on("mouseout", function () { d3.select(this).attr("stroke", d => d.children ? color(d.depth) : "#ccc"); })
            .on("click", (event, d) => d.children && zoom(event, d)); // Зум по клику на родительский узел

        node.append("title") // Всплывающая подсказка
            .text(d => `${d.ancestors().map(d => d.data.title).reverse().join(" → ")}\nValue: ${d.value}`);

        // Добавляем текст только для узлов, у которых нет детей (или для достаточно больших)
        const label = node.filter(d => !d.children && d.r > 10) // Порог видимости текста
            .append("text")
            .attr("clip-path", d => `circle(${d.r})`) // Обрезаем текст по кругу
            .style("font-size", "10px")
            .style("fill-opacity", 1)
            .style("pointer-events", "none") // Чтобы текст не мешал кликам по кругу
            .attr("text-anchor", "middle");

        label.selectAll("tspan")
            .data(d => d.data.title.split(/(?=[A-Z][a-z])|\s+/g)) // Разбиваем название на строки для переноса (упрощенный вариант)
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`) // Центрируем вертикально
            .text(d => d);


        // --- Функция зума ---
        let focus = packedRoot;

        function zoomTo(v) {
            const k = width / (v.r * 2); // Коэффициент масштабирования

            node.transition().duration(750)
                .attr("transform", d => `translate(${(d.x - v.x) * k},${(d.y - v.y) * k})`);

            node.select("circle").transition().duration(750)
                .attr("r", d => d.r * k);

            // Показать/скрыть текст при зуме (опционально)
            label.transition().duration(750)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .style("display", d => d.parent === focus ? "inline" : "none");
        }

        function zoom(event, d) {
            event.stopPropagation(); // Предотвращаем всплытие события, чтобы не сработал зум на SVG
            focus = d;
            zoomTo(focus);
        }

        // Начальный зум (показываем все)
        zoomTo(packedRoot);


    }, [data, width, height]); // Перерисовываем при изменении данных или размеров

    return (
        <svg ref={svgRef}></svg>
    );
};

export default CirclePackingDiagram;