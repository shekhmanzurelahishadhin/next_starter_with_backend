"use client";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface FormItem {
  id: number;
  name: string;
  email: string;
  value: string;
}

function GridForm() {
  const [items, setItems] = useState<FormItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    value: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setItems([...items, { ...formData, id: Date.now() }]);
      setFormData({ name: '', email: '', value: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateItem = (id: number, field: keyof FormItem, value: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Editable Grid Form</h3>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end mb-8">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Your Name"
            required
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Your Email"
            required
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Value
          </label>
          <input
            name="value"
            type="text"
            value={formData.value}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Additional Value"
          />
        </div>

        <div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
          >
            Add Row
          </button>
        </div>
      </form>

      {/* Grid Display */}
      {items.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="col-span-3 p-4 font-semibold text-gray-900 dark:text-white">Name</div>
            <div className="col-span-3 p-4 font-semibold text-gray-900 dark:text-white">Email</div>
            <div className="col-span-4 p-4 font-semibold text-gray-900 dark:text-white">Value</div>
            <div className="col-span-2 p-4 font-semibold text-gray-900 dark:text-white">Actions</div>
          </div>

          {/* {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
              <div className="col-span-3 p-4">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="col-span-3 p-4">
                <input
                  type="email"
                  value={item.email}
                  onChange={(e) => updateItem(item.id, 'email', e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="col-span-4 p-4">
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="col-span-2 p-4">
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))} */}

        </div>
      )}
      <Table className="table-fixed">
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell
              isHeader
              className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >Sl</TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Value</TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

          <TableRow>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              1
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              shadhin@18gmail.com
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              55
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              X
            </TableCell>

          </TableRow>

        </TableBody>
      </Table>
    </div>
  );
}

export default GridForm;