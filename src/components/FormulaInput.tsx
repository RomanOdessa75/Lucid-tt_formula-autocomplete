"use client";

import { Select } from "antd";
import { evaluateFormula } from "@/utils";
import { useFormulaInput } from "@/hooks";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  PlusOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { message } from "antd";

const OPERATORS = ["+", "-", "*", "/", "^", "(", ")"];

// const FAKE_LOCK_ENDPOINT = "https://fake.api/lock";

const initialRow = () => ({
  formula: [],
  locked: false,
  loading: false,
});

type FormulaRow = {
  formula: string[];
  locked: boolean;
  loading: boolean;
};

const FormulaInput = () => {
  const { suggestions, isLoading } = useFormulaInput();

  const [rows, setRows] = useState<FormulaRow[]>([initialRow()]);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([""]);

  const lockMutation = useMutation({
    mutationFn: async (rowIdx: number) => {
      setRows((prev) =>
        prev.map((row, idx) =>
          idx === rowIdx ? { ...row, loading: true } : row
        )
      );
      await new Promise((res) => setTimeout(res, 2000));
      return true;
    },
    onSuccess: (_data, rowIdx) => {
      setRows((prev) =>
        prev.map((row, idx) =>
          idx === rowIdx ? { ...row, locked: !row.locked, loading: false } : row
        )
      );
    },
    onError: (_err, rowIdx) => {
      setRows((prev) =>
        prev.map((row, idx) =>
          idx === rowIdx ? { ...row, loading: false } : row
        )
      );
    },
  });

  const getOptions = (inputValue: string) => {
    const seen = new Set<string>();
    const filteredSuggestions = suggestions.filter((item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    const filteredOperators = OPERATORS.filter((op) => op.includes(inputValue));
    return [
      ...filteredSuggestions
        .filter((item) => {
          if (seen.has(item.name)) return false;
          seen.add(item.name);
          return true;
        })
        .map((item) => ({
          value: item.name,
          label: item.name,
          key: `suggestion-${item.id}`,
        })),
      ...filteredOperators
        .filter((op) => {
          if (seen.has(op)) return false;
          seen.add(op);
          return true;
        })
        .map((op, idx) => ({ value: op, label: op, key: `op-${op}-${idx}` })),
    ];
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, initialRow()]);
    setInputValues((prev) => [...prev, ""]);
    message.info({ content: "New formula", duration: 1, key: "new-formula" });
  };

  const handleDeleteRow = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
    setInputValues((prev) => prev.filter((_, i) => i !== idx));
    setOpenIndexes((prev) => prev.filter((i) => i !== idx));
  };

  const handleChange = (values: string[], idx: number) => {
    setRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, formula: values } : row))
    );
  };

  const handleInput = (val: string, idx: number) => {
    setInputValues((prev) => prev.map((v, i) => (i === idx ? val : v)));
    setOpenIndexes((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  const handleOpenChange = (open: boolean, idx: number) => {
    setOpenIndexes((prev) =>
      open ? [...prev, idx] : prev.filter((i) => i !== idx)
    );
  };

  const handleLock = (idx: number) => {
    lockMutation.mutate(idx);
  };

  return (
    <div
      className="w-[80vw] h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col justify-start items-center relative"
      style={{ boxShadow: "0 8px 32px 0 rgba(60,60,60,0.18)" }}
    >
      <div className="w-full text-center py-6 border-b border-b-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          Formula editor (autocomplete)
        </h2>
      </div>
      <div className="flex-1 w-full flex flex-col items-center overflow-auto py-8">
        <div className="flex w-full max-w-6xl mx-auto mb-4">
          <button
            className="w-8 h-8 flex items-center justify-center bg-[#f5f6fa] border border-gray-300 rounded hover:bg-gray-200 transition text-xl text-gray-700 mx-auto relative group"
            onClick={handleAddRow}
            aria-label="Add row"
            type="button"
          >
            <PlusOutlined />
            <span className="absolute left-1/2 -translate-x-1/2 top-10 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
              New formula
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
          {rows.map((row, idx) => (
            <div key={idx} className="flex items-center w-full">
              <div className="flex flex-col items-center w-1/3 min-w-[180px]">
                <Select
                  mode="tags"
                  open={openIndexes.includes(idx)}
                  onOpenChange={(open) => handleOpenChange(open, idx)}
                  value={row.formula}
                  onChange={(vals) => handleChange(vals, idx)}
                  onSearch={(val) => handleInput(val, idx)}
                  filterOption={false}
                  placeholder="Enter formula..."
                  style={{
                    width: "100%",
                    borderColor: row.locked
                      ? "#d1d5db"
                      : openIndexes.includes(idx)
                      ? "#000"
                      : "#333",
                    borderWidth: 1.5,
                    borderRadius: 8,
                    background: row.locked ? "#f5f6fa" : "#fff",
                    pointerEvents: row.locked ? "none" : undefined,
                    opacity: row.loading ? 0.6 : 1,
                  }}
                  className="custom-formula-select"
                  tokenSeparators={[" "]}
                  options={getOptions(inputValues[idx] || "")}
                  loading={isLoading || row.loading}
                  styles={{ popup: { root: { zIndex: 2000 } } }}
                  disabled={row.locked}
                />
              </div>
              <div className="mx-4 h-[44px] w-[2px] bg-[#333] opacity-60 rounded-full" />
              <div className="flex flex-col justify-center w-1/3 min-w-[120px]">
                {row.formula && row.formula.length > 0 ? (
                  <div className="w-full text-lg text-gray-700 break-words select-none min-h-[44px] flex items-center px-4">
                    {row.formula.join(" ")}
                  </div>
                ) : (
                  <div className="w-full min-h-[44px] bg-[#f5f6fa] rounded-lg px-4 py-3 text-gray-400 flex items-center">
                    &nbsp;
                  </div>
                )}
              </div>
              <div className="mx-4 h-[44px] w-[2px] bg-[#333] opacity-60 rounded-full" />
              <div className="flex items-center w-1/3 min-w-[120px]">
                <div className="w-full bg-[#f5f6fa] rounded-lg px-4 py-3 text-gray-800 text-base font-medium shadow-none flex items-center justify-between">
                  <span className="text-gray-500">Result:</span>
                  <span>{evaluateFormula(row.formula, suggestions)}</span>
                </div>
                <div className="flex items-center ml-4">
                  <button
                    className="ml-2 text-xl text-gray-500 hover:text-gray-700 transition"
                    onClick={() => handleLock(idx)}
                    disabled={row.loading}
                    aria-label={row.locked ? "Unlock" : "Lock"}
                    type="button"
                  >
                    {row.locked ? <LockOutlined /> : <UnlockOutlined />}
                  </button>
                  <button
                    className="ml-2 text-xl text-red-500 hover:text-red-700 transition"
                    onClick={() => handleDeleteRow(idx)}
                    aria-label="Delete row"
                    type="button"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .custom-formula-select .ant-select-selector {
          border-color: #333 !important;
          border-width: 1.5px !important;
          border-radius: 8px !important;
          background: #fff !important;
        }
        .custom-formula-select .ant-select-selector:focus,
        .custom-formula-select .ant-select-selector:active {
          border-color: #000 !important;
        }
        .custom-formula-select .ant-select-selector[aria-disabled="true"] {
          border-color: #d1d5db !important;
          background: #f5f6fa !important;
        }
        .custom-formula-select .ant-select-selection-placeholder {
          color: #888 !important;
        }
      `}</style>
    </div>
  );
};

export default FormulaInput;
