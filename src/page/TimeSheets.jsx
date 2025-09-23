
import React, { useState, useEffect, useCallback } from 'react'
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  Timer,
  Coffee
} from "lucide-react"
import API from '../api/axios'
import * as XLSX from 'xlsx'
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const columnHelper = createColumnHelper()

const displayValue = (value, suffix = '') =>
  value != null && value !== '' ? `${value}${suffix}` : '-'

const getTimeOnly = (isoString) => {
  if (!isoString) return '-'
  try {
    return new Date(isoString).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } catch {
    return '-'
  }
}

const columns = [
  columnHelper.accessor('date', {
    id: 'date',
    header: () => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Date
      </div>
    ),
    cell: info => displayValue(info.getValue())
  }),
  columnHelper.accessor('entry_time', {
    id: 'entry_time',
    header: () => (
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Entry Time
      </div>
    ),
    cell: info => getTimeOnly(info.getValue())
  }),
  columnHelper.accessor('exit_time', {
    id: 'exit_time',
    header: () => (
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Exit Time
      </div>
    ),
    cell: info => getTimeOnly(info.getValue())
  }),
  columnHelper.accessor('total_hour', {
    id: 'total_hour',
    header: () => (
      <div className="flex items-center gap-2">
        <Timer className="w-4 h-4" />
        Total Hours
      </div>
    ),
    cell: info => displayValue(info.getValue(), 'h')
  }),
  columnHelper.accessor('over_time', {
    id: 'over_time',
    header: () => (
      <div className="flex items-center gap-2">
        <Timer className="w-4 h-4" />
        Overtime
      </div>
    ),
    cell: info => displayValue(info.getValue(), 'h')
  }),
  columnHelper.accessor('break_time', {
    id: 'break_time',
    header: () => (
      <div className="flex items-center gap-2">
        <Coffee className="w-4 h-4" />
        Break Time
      </div>
    ),
    cell: info => displayValue(info.getValue(), 'm')
  }),
]

const exportOptions = [
  { label: "CSV", icon: FileText, value: "csv" },
  { label: "Excel", icon: FileSpreadsheet, value: "excel" },
  { label: "PDF", icon: FileDown, value: "pdf" },
  { label: "Print", icon: Printer, value: "print" },
]

export default function TimeSheets() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const tableData = Array.isArray(data) ? data : []
  const totalPages = Math.ceil(totalRows / pagination.pageSize) || 1

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const res = await API.get(
          `/api/timesheets/attendencelogs/?start_date=${startDate}&end_date=${endDate}&page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`
      )
        const apiData = res.data
        setData(apiData.data || [])
        setTotalRows(apiData.count || apiData.data.length)
      } catch (error) {
        console.error('Error fetching data:', error)
        setData([])
        setTotalRows(0)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize, startDate, endDate])

  // React Table
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: { pagination },
    onPaginationChange: setPagination,
  })

  // Filters
  const applyFilter = () => {
    setPagination(old => ({ ...old, pageIndex: 0 }))
    setShowFilter(false)
  }

  const clearFilter = () => {
    setStartDate('')
    setEndDate('')
    setPagination(old => ({ ...old, pageIndex: 0 }))
    setShowFilter(false)
  }

  // Export handlers
  const downloadCSV = useCallback(() => {
    if (!tableData.length) {
      alert("No data available to export")
      return
    }
    
    const headers = columns.map(col => {
      if (typeof col.header === 'function') {
        return col.id.replace('_', ' ').toUpperCase()
      }
      return col.header
    }).join(',')
    
    const rows = tableData.map(row =>
      columns.map(col => {
        const value = row[col.id]
        if (col.id === 'entry_time' || col.id === 'exit_time') return `"${getTimeOnly(value)}"`
        if (['total_hour', 'over_time', 'break_time'].includes(col.id)) return `"${displayValue(value)}"`
        return `"${value ?? '-'}"`
      }).join(',')
    )
    
    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `timesheets_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [tableData])


 const downloadExcel = useCallback(() => {
    if (!tableData.length) return
    const dataForExcel = tableData.map(row =>
      columns.reduce((acc, col) => {
        let value = row[col.id]
        if (['entry_time','exit_time'].includes(col.id)) value = getTimeOnly(value)
        if (['total_hour','over_time','break_time'].includes(col.id)) value = displayValue(value)
        acc[col.id] = value ?? '-'
        return acc
      }, {})
    )
    const ws = XLSX.utils.json_to_sheet(dataForExcel)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Timesheets')
    XLSX.writeFile(wb, `timesheets_${new Date().toISOString()}.xlsx`)
  }, [tableData])

  const downloadPDF = useCallback(() => {
    if (!tableData.length) return
    const doc = new jsPDF()
    const headers = columns.map(col => col.id.toUpperCase())
    const rows = tableData.map(row =>
      columns.map(col => {
        let value = row[col.id]
        if (['entry_time','exit_time'].includes(col.id)) value = getTimeOnly(value)
        if (['total_hour','over_time','break_time'].includes(col.id)) value = displayValue(value)
        return value ?? '-'
      })
    )
    autoTable(doc, { head: [headers], body: rows })
    doc.save(`timesheets_${new Date().toISOString()}.pdf`)
  }, [tableData])


  const handlePrint = useCallback(() => {
    if (!tableData.length) {
      alert("No data available to print")
      return
    }
    
    const printWindow = window.open('', '_blank')
    const printContent = `
      <html>
        <head>
          <title>Timesheets</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Timesheets Report</h1>
          <table>
            <thead>
              <tr>
                ${columns.map(col => `<th>${col.id.replace('_', ' ').toUpperCase()}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableData.map(row => `
                <tr>
                  ${columns.map(col => {
                    let value = row[col.id]
                    if (col.id === 'entry_time' || col.id === 'exit_time') value = getTimeOnly(value)
                    if (['total_hour', 'over_time', 'break_time'].includes(col.id)) value = displayValue(value)
                    return `<td>${value ?? '-'}</td>`
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }, [tableData])

  const handleExport = useCallback((type) => {
    switch (type) {
      case 'csv':
        downloadCSV()
        break
      case 'excel':
        downloadExcel()
        break
      case 'pdf':
        downloadPDF()
        break
      case 'print':
        handlePrint()
        break
      default:
        break
    }
    setShowExportDropdown(false)
  }, [downloadCSV, downloadExcel, downloadPDF, handlePrint])

  return (
    <div className="w-full p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Timesheets</h1>
        <p className="text-gray-300">Manage and export your timesheet data</p>
      </div>

      {/* Top Bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 transform hover:scale-105"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg shadow-lg hover:from-green-500 hover:to-teal-500 transition-all duration-200 transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Export
            <ChevronDown className="w-4 h-4" />
          </button>

          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
              {exportOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleExport(option.value)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-150 first:rounded-t-lg last:rounded-b-lg"
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="w-full sm:w-80 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 mb-6">
          <h3 className="text-white text-lg font-semibold mb-4">Filter Options</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={clearFilter}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
              >
                Clear
              </button>
              <button
                onClick={applyFilter}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <>
          <div className="hidden sm:block w-full bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-6 py-4 text-left text-white font-semibold">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-gray-700/50 border-b border-gray-700 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'
                      }`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 text-gray-100">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Table */}
          <div className="sm:hidden flex flex-col gap-4">
            {table.getRowModel().rows.map((row, index) => (
              <div 
                key={row.id} 
                className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-lg text-white border border-gray-700"
              >
                {row.getVisibleCells().map(cell => (
                  <div key={cell.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                    <span className="font-semibold text-gray-300">
                      {flexRender(cell.column.columnDef.header, cell.getContext())}:
                    </span>
                    <span className="text-white">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && tableData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No timesheet data found</div>
          <div className="text-gray-500 text-sm mt-2">Try adjusting your filter criteria</div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && tableData.length > 0 && (
        <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl">
          <div className="text-gray-300 text-center lg:text-left">
            Page {pagination.pageIndex + 1} of {totalPages} | Total: {totalRows} records
          </div>
          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={() => setPagination(old => ({ ...old, pageIndex: old.pageIndex - 1 }))}
              disabled={pagination.pageIndex === 0}
              className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(old => ({ ...old, pageIndex: old.pageIndex + 1 }))}
              disabled={pagination.pageIndex + 1 >= totalPages}
              className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-gray-300">Rows per page:</span>
              <select
                value={pagination.pageSize}
                onChange={e => setPagination(old => ({ ...old, pageSize: Number(e.target.value), pageIndex: 0 }))}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 10, 20, 50].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}








// import React, { useState, useEffect, useCallback } from 'react'
// import {
//   useReactTable,
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
// } from '@tanstack/react-table'
// import API from "../api/axios"

// import {
//   Download,
//   FileText,
//   FileSpreadsheet,
//   FileDown,
//   Printer,
//   Filter,
//   ChevronDown,
//   Calendar,
//   Clock,
//   Timer,
//   Coffee
// } from "lucide-react"

// // --- Helpers ---
// const columnHelper = createColumnHelper()
// const displayValue = (value, suffix = '') =>
//   value != null && value !== '' ? `${value}${suffix}` : '-'

// const getTimeOnly = (isoString) => {
//   if (!isoString) return '-'
//   try {
//     return new Date(isoString).toLocaleTimeString('en-US', {
//       hour12: false,
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   } catch {
//     return '-'
//   }
// }

// // --- Columns ---
// const columns = [
//   columnHelper.accessor('date', {
//     id: 'date',
//     header: () => <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/>Date</div>,
//     cell: info => displayValue(info.getValue())
//   }),
//   columnHelper.accessor('entry_time', {
//     id: 'entry_time',
//     header: () => <div className="flex items-center gap-2"><Clock className="w-4 h-4"/>Entry Time</div>,
//     cell: info => getTimeOnly(info.getValue())
//   }),
//   columnHelper.accessor('exit_time', {
//     id: 'exit_time',
//     header: () => <div className="flex items-center gap-2"><Clock className="w-4 h-4"/>Exit Time</div>,
//     cell: info => getTimeOnly(info.getValue())
//   }),
//   columnHelper.accessor('total_hour', {
//     id: 'total_hour',
//     header: () => <div className="flex items-center gap-2"><Timer className="w-4 h-4"/>Total Hours</div>,
//     cell: info => displayValue(info.getValue(), 'h')
//   }),
//   columnHelper.accessor('over_time', {
//     id: 'over_time',
//     header: () => <div className="flex items-center gap-2"><Timer className="w-4 h-4"/>Overtime</div>,
//     cell: info => displayValue(info.getValue(), 'h')
//   }),
//   columnHelper.accessor('break_time', {
//     id: 'break_time',
//     header: () => <div className="flex items-center gap-2"><Coffee className="w-4 h-4"/>Break Time</div>,
//     cell: info => displayValue(info.getValue(), 'm')
//   }),
// ]

// export default function TimeSheets() {
//   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
//   const [data, setData] = useState([])
//   const [totalRows, setTotalRows] = useState(0)
//   const [startDate, setStartDate] = useState('')
//   const [endDate, setEndDate] = useState('')
//   const [showFilter, setShowFilter] = useState(false)
//   const [showExportDropdown, setShowExportDropdown] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const tableData = Array.isArray(data) ? data : []
//   const totalPages = Math.ceil(totalRows / pagination.pageSize) || 1

//   // --- Fetch API Data ---
//   useEffect(() => {
//     async function fetchData() {
//       setIsLoading(true)
//       try {
//         const res = await API.get(
//           `/api/timesheets/attendencelogs/?start_date=${startDate}&end_date=${endDate}&page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`
//         )
//         const apiData = res.data
//         setData(apiData.data || [])
//         setTotalRows(apiData.count || apiData.data.length)
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         setData([])
//         setTotalRows(0)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchData()
//   }, [pagination.pageIndex, pagination.pageSize, startDate, endDate])

//   // --- Table ---
//   const table = useReactTable({
//     data: tableData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     manualPagination: true,
//     pageCount: totalPages,
//     state: { pagination },
//     onPaginationChange: setPagination,
//   })

//   // --- Export Functions ---
//   const downloadCSV = useCallback(() => {
//     if (!tableData.length) return
//     const headers = columns.map(col => col.id.toUpperCase()).join(',')
//     const rows = tableData.map(row =>
//       columns.map(col => {
//         let value = row[col.id]
//         if (['entry_time','exit_time'].includes(col.id)) value = getTimeOnly(value)
//         if (['total_hour','over_time','break_time'].includes(col.id)) value = displayValue(value)
//         return `"${value ?? '-'}"`
//       }).join(',')
//     )
//     const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
//     const link = document.createElement('a')
//     link.href = URL.createObjectURL(blob)
//     link.setAttribute('download', `timesheets_${new Date().toISOString()}.csv`)
//     link.click()
//   }, [tableData])

 

//   // --- Filters ---
//   const applyFilter = () => {
//     setPagination(old => ({ ...old, pageIndex: 0 }))
//     setShowFilter(false)
//   }
//   const clearFilter = () => {
//     setStartDate('')
//     setEndDate('')
//     setPagination(old => ({ ...old, pageIndex: 0 }))
//     setShowFilter(false)
//   }

//   // --- UI ---
//   return (
//     <div className="p-4">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
//         <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
//           Timesheet Records
//         </h2>
//         <div className="flex gap-2">
//           {/* Filter Button */}
//           <button
//             onClick={() => setShowFilter(!showFilter)}
//             className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg flex items-center gap-2 shadow hover:scale-105 transition"
//           >
//             <Filter className="w-4 h-4"/> Filters
//           </button>
//           {/* Export Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setShowExportDropdown(!showExportDropdown)}
//               className="px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-lg flex items-center gap-2 shadow hover:scale-105 transition"
//             >
//               <Download className="w-4 h-4"/> Export <ChevronDown className="w-4 h-4"/>
//             </button>
//             {showExportDropdown && (
//               <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
//                 <button onClick={() => handleExport('csv')} className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
//                   <FileText className="w-4 h-4"/> CSV
//                 </button>
//                 <button onClick={() => handleExport('excel')} className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
//                   <FileSpreadsheet className="w-4 h-4"/> Excel
//                 </button>
//                 <button onClick={() => handleExport('pdf')} className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
//                   <FileDown className="w-4 h-4"/> PDF
//                 </button>
//                 <button onClick={() => handleExport('print')} className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
//                   <Printer className="w-4 h-4"/> Print
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Filter Panel */}
//       {showFilter && (
//         <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow flex flex-col md:flex-row gap-4">
//           <div className="flex flex-col">
//             <label className="text-sm font-medium">Start Date</label>
//             <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
//               className="px-3 py-2 border rounded-lg"/>
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm font-medium">End Date</label>
//             <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
//               className="px-3 py-2 border rounded-lg"/>
//           </div>
//           <div className="flex gap-2 items-end">
//             <button onClick={applyFilter} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:scale-105">Apply</button>
//             <button onClick={clearFilter} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:scale-105">Clear</button>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       <div className="overflow-x-auto bg-white rounded-lg shadow">
//         <table className="w-full">
//           <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
//             {table.getHeaderGroups().map(headerGroup => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <th key={header.id} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr><td colSpan={columns.length} className="text-center py-4">Loading...</td></tr>
//             ) : table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map(row => (
//                 <tr key={row.id} className="border-t hover:bg-gray-50">
//                   {row.getVisibleCells().map(cell => (
//                     <td key={cell.id} className="px-4 py-2 text-sm text-gray-700">
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan={columns.length} className="text-center py-4">No records found</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

    
//       {/* Pagination */}
// <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
//   {/* Rows per page selector */}
//   <div className="flex items-center gap-2">
//     <span className="text-sm">Rows per page:</span>
//     <select
//       value={pagination.pageSize}
//       onChange={(e) =>
//         setPagination(old => ({ ...old, pageSize: Number(e.target.value), pageIndex: 0 }))
//       }
//       className="border rounded px-2 py-1 text-sm"
//     >
//       {[5, 10, 20, 50].map(size => (
//         <option key={size} value={size}>{size}</option>
//       ))}
//     </select>
//   </div>

//   {/* Page navigation */}
//   <div className="flex items-center gap-2">
//     <button
//       onClick={() => setPagination(old => ({ ...old, pageIndex: 0 }))}
//       disabled={pagination.pageIndex === 0}
//       className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
//     >
//       {"<<"}
//     </button>
//     <button
//       onClick={() => setPagination(old => ({ ...old, pageIndex: Math.max(old.pageIndex - 1, 0) }))}
//       disabled={pagination.pageIndex === 0}
//       className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
//     >
//       Previous
//     </button>
//     <span className="text-sm">
//       Page {pagination.pageIndex + 1} of {totalPages}
//     </span>
//     <button
//       onClick={() => setPagination(old => ({ ...old, pageIndex: Math.min(old.pageIndex + 1, totalPages - 1) }))}
//       disabled={pagination.pageIndex + 1 >= totalPages}
//       className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
//     >
//       Next
//     </button>
//     <button
//       onClick={() => setPagination(old => ({ ...old, pageIndex: totalPages - 1 }))}
//       disabled={pagination.pageIndex + 1 >= totalPages}
//       className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
//     >
//       {">>"}
//     </button>
//   </div>

//   {/* Go to page */}
//   <div className="flex items-center gap-2">
//     <span className="text-sm">Go to page:</span>
//     <input
//       type="number"
//       min={1}
//       max={totalPages}
//       value={pagination.pageIndex + 1}
//       onChange={(e) => {
//         const page = e.target.value ? Number(e.target.value) - 1 : 0
//         setPagination(old => ({ ...old, pageIndex: page }))
//       }}
//       className="w-16 border rounded px-2 py-1 text-sm"
//     />
//   </div>
// </div>
// </div>
//   )
// }
