"use client";
import React from "react";

export default function Table({ columns, data }: { columns: string[]; data: any[] }) {
  return (
    <div className="card overflow-x-auto">
      <table className="table-auto w-full text-left text-sm">
        <thead className="bg-gray-800 text-gray-200">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-2 font-semibold">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/30">
              {columns.map((c, i) => (
                <td key={i} className="px-4 py-2">{(row as any)[c] ?? JSON.stringify((row as any)[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
