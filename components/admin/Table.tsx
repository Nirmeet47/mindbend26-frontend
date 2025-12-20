"use client";
import React from "react";

export default function Table({ columns, data }: { columns: string[]; data: any[] }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mt-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400 text-sm">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                {columns.map((c, i) => (
                  <td
                    key={i}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 align-middle"
                  >
                    {(row as any)[c] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
