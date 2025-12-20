"use client";
import React from "react";

export default function Table({ columns, data }: { columns: string[]; data: any[] }) {
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((c, i) => (
                <td key={i}>{(row as any)[c] ?? JSON.stringify((row as any)[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
