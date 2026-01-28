"use client";
import React from "react";

interface TableProps {
  columns: string[];
  data: any[];
  actions?: (row: any) => React.ReactNode;
}

export default function Table({ columns, data, actions }: TableProps) {
  const hasActions = !!actions;

  const formatColumnName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toUpperCase()
      .replace(/_/g, ' ');
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-black/40 border-b border-white/5">
              {columns.map((c) => (
                <th
                  key={c}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  {formatColumnName(c)}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (hasActions ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H1" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">No data available</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="group hover:bg-white/5 transition-all duration-200"
                >
                  {columns.map((c, i) => (
                    <td
                      key={i}
                      className="px-6 py-4 text-sm text-gray-200 font-medium"
                    >
                      <div className="flex items-center min-h-[2rem]">
                        {(row as any)[c] ?? (
                          <span className="text-gray-500 italic">—</span>
                        )}
                      </div>
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center min-h-[2rem]">
                        {actions!(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
