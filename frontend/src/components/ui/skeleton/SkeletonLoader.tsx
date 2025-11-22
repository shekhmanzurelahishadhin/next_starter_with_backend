import React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { TableCell, TableRow } from '../table'

interface SkeletonLoaderProps {
  columns: ColumnDef<any, any>[]
  rowCount?: number
}

export default function SkeletonLoader({ columns, rowCount = 5 }: SkeletonLoaderProps) {
  // Use smaller, more reasonable widths
  const getSkeletonWidth = (index: number) => {
    const widths = ['w-16', 'w-20', 'w-24', 'w-28', 'w-20', 'w-16'];
    return widths[index % widths.length];
  };

  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={`skeleton-${rowIndex}`}>
          {columns.map((_, colIndex) => (
            <TableCell
              key={`skeleton-${rowIndex}-${colIndex}`}
              className="px-5 py-4 text-start"
            >
              <div 
                className={`h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse ${getSkeletonWidth(colIndex)}`}
              ></div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}