"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {SORT_FIELDS,SearchQuerySchema,defaultQuery,} from "../lib/products";
import type { SearchQuery } from "../lib/products";

type ProductSearchFormProps = {
onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({onSearch,}: ProductSearchFormProps) {
const {
register,
handleSubmit,
formState: { errors, isSubmitting },
} = useForm<SearchQuery>({
resolver: zodResolver(SearchQuerySchema),
mode: "onTouched",
defaultValues: defaultQuery,
});

return (
<form
onSubmit={handleSubmit(onSearch)}
noValidate
style={{
display: "grid",
gridTemplateColumns: "minmax(220px, 1fr) 140px 180px auto",
alignItems: "start",
gap: "1rem",
padding: "1.5rem",
background: "#ffffff",
border: "1px solid #e5e7eb",
borderRadius: "16px",
boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
}}
>
<div style={{ display: "grid", gap: "0.5rem" }}>
<label
htmlFor="q"
style={{
fontSize: "0.9rem",
fontWeight: 600,
color: "#334155",
}}
>
คำค้น
</label>

    <input
      id="q"
      {...register("q")}
      placeholder="เช่น phone"
      style={{
        width: "100%",
        boxSizing: "border-box",
        height: "44px",
        padding: "0 0.9rem",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        outline: "none",
        font: "inherit",
        color: "#0f172a",
        background: "#fff",
      }}
    />
  </div>

  <div style={{
    display: "grid",
    gap: "0.5rem",
    alignContent: "start",
  }}
>
  
    <label
      htmlFor="limit"
      style={{
        fontSize: "0.9rem",
        fontWeight: 600,
        color: "#334155",
      }}
    >
      จำนวนรายการ
    </label>

    <input
      id="limit"
      type="number"
      required
      {...register("limit", {
        valueAsNumber: true,
      })}
      aria-invalid={!!errors.limit}
      aria-describedby="limit-error"
      style={{
        width: "100%",
        boxSizing: "border-box",
        height: "44px",
        padding: "0 0.9rem",
        border: `1px solid ${
          errors.limit ? "#ef4444" : "#cbd5e1"
        }`,
        borderRadius: "10px",
        outline: "none",
        font: "inherit",
        color: "#0f172a",
        background: "#fff",
      }}
    />

    <span
      id="limit-error"
      role="alert"
      style={{
        minHeight: "1.1rem",
        color: "#dc2626",
        fontSize: "0.8rem",
      }}
    >
      {errors.limit?.message}
    </span>
  </div>

  <div style={{
    display: "grid",
    gap: "0.5rem",
    alignContent: "start",
  }}
>
    <label
      htmlFor="sortBy"
      style={{
        fontSize: "0.9rem",
        fontWeight: 600,
        color: "#334155",
      }}
    >
      เรียงตาม
    </label>

<select
  id="sortBy"
  {...register("sortBy")}
  style={{
    width: "100%",
    boxSizing: "border-box",
    height: "44px",
    padding: "0 0.9rem",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#fff",
    outline: "none",
    font: "inherit",
    color: "#0f172a",
    cursor: "pointer",
  }}
>
  {SORT_FIELDS.map((field: string) => (
    <option key={field} value={field}>
      {field}
    </option>
  ))}
</select>
  </div>

<button
  type="submit"
  disabled={isSubmitting}
  style={{
    alignSelf: "end",
    height: "44px",
    padding: "0 1.5rem",
    border: 0,
    borderRadius: "10px",
    background: isSubmitting ? "#94a3b8" : "#2563eb",
    color: "#fff",
    font: "inherit",
    fontWeight: 700,
    cursor: isSubmitting ? "wait" : "pointer",
    boxShadow: isSubmitting
      ? "none"
      : "0 4px 12px rgba(37, 99, 235, 0.25)",
    transition: "all 150ms ease",
    whiteSpace: "nowrap",
  }}
>
    {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
  </button>
</form>


);
}