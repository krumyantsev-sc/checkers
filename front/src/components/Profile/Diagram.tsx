
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Props {
    data: { name: string; value: number }[];
}

const Diagram: React.FC<Props> = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F'];

    return (
        <PieChart width={200} height={200}>
            <Pie
                data={data}
                cx={100}
                cy={100}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
};

export default Diagram;