"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORIES, ProductSchema } from "../lib/products";
import type { Product } from "../lib/products";

type ProductDraft = z.infer<typeof ProductSchema>;

type ProductFormProps = {
    editing: Product | null;
    onSave: (draft: ProductDraft) => void;
    onCancel: () => void;
};

export default function ProductForm({
    editing,
    onSave,
    onCancel,
}: ProductFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = useForm<ProductDraft>({
        resolver: zodResolver(ProductSchema),
        mode: "onTouched",
        defaultValues: editing
            ? {
                title: editing.title,
                price: editing.price,
                stock: editing.stock,
                category: editing.category,
            }
            : {
                title: "",
                price: 0,
                stock: 0,
                category: CATEGORIES[0],
            },
    });

    const inputStyle = (hasError: boolean) => ({
        width: "100%",
        boxSizing: "border-box" as const,
        height: "46px",
        padding: "0 14px",
        border: `1px solid ${hasError ? "#ef4444" : "#dbe3ee"
            }`,
        borderRadius: "10px",
        outline: "none",
        font: "inherit",
        fontSize: "14px",
        color: "#0f172a",
        background: "#f8fafc",
        transition: "all 150ms ease",
    });

    const fieldStyle = {
        display: "grid",
        gap: "7px",
    };

    const labelStyle = {
        fontSize: "14px",
        fontWeight: 650,
        color: "#334155",
    };

    const errorStyle = {
        minHeight: "18px",
        color: "#dc2626",
        fontSize: "12px",
        marginTop: "1px",
    };

    return (
        <form
            onSubmit={handleSubmit(onSave)}
            noValidate
            style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(auto-fit, minmax(210px, 1fr))",
                alignItems: "start",
                gap: "20px",
                padding: "24px",
                background: "#f7f7f8",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                boxShadow:
                    "inset 0 1px 2px rgba(247, 247, 247, 0.02)",
            }}
        >
            <div style={fieldStyle}>
                <label
                    htmlFor="title"
                    style={labelStyle}
                >
                    ชื่อสินค้า
                </label>

                <input
                    id="title"
                    required
                    {...register("title")}
                    aria-invalid={!!errors.title}
                    aria-describedby="title-error"
                    placeholder="เช่น iPhone 17"
                    style={inputStyle(!!errors.title)}
                />

                <span
                    id="title-error"
                    role="alert"
                    style={errorStyle}
                >
                    {errors.title?.message}
                </span>
            </div>

            <div style={fieldStyle}>
                <label
                    htmlFor="price"
                    style={labelStyle}
                >
                    ราคา
                </label>

                <input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    {...register("price", {
                        valueAsNumber: true,
                    })}
                    aria-invalid={!!errors.price}
                    aria-describedby="price-error"
                    placeholder="0.00"
                    style={inputStyle(!!errors.price)}
                />

                <span
                    id="price-error"
                    role="alert"
                    style={errorStyle}
                >
                    {errors.price?.message}
                </span>
            </div>

            <div style={fieldStyle}>
                <label
                    htmlFor="stock"
                    style={labelStyle}
                >
                    จำนวนสินค้า
                </label>

                <input
                    id="stock"
                    type="number"
                    required
                    {...register("stock", {
                        valueAsNumber: true,
                    })}
                    aria-invalid={!!errors.stock}
                    aria-describedby="stock-error"
                    placeholder="0"
                    style={inputStyle(!!errors.stock)}
                />

                <span
                    id="stock-error"
                    role="alert"
                    style={errorStyle}
                >
                    {errors.stock?.message}
                </span>
            </div>

            <div style={fieldStyle}>
                <label
                    htmlFor="category"
                    style={labelStyle}
                >
                    หมวดหมู่
                </label>

                <select
                    id="category"
                    required
                    {...register("category")}
                    aria-invalid={!!errors.category}
                    aria-describedby="category-error"
                    style={{
                        ...inputStyle(!!errors.category),
                        cursor: "pointer",
                    }}
                >
                    <option value="">
                        เลือกหมวดหมู่
                    </option>

                    {CATEGORIES.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>

                <span
                    id="category-error"
                    role="alert"
                    style={errorStyle}
                >
                    {errors.category?.message}
                </span>
            </div>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "10px",
                    gridColumn: "1 / -1",
                    paddingTop: "18px",
                    marginTop: "2px",
                    borderTop: "1px solid #ebecee",
                }}
            >
                {editing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            height: "44px",
                            padding: "0 20px",
                            border: "1px solid #516d8f",
                            borderRadius: "10px",
                            background: "#4f806b",
                            color: "#475569",
                            font: "inherit",
                            fontSize: "14px",
                            fontWeight: 650,
                            cursor: "pointer",
                            transition: "all 150ms ease",
                        }}
                    >
                        ยกเลิก
                    </button>
                )}

                <button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    style={{
                        height: "44px",
                        padding: "0 22px",
                        border: "none",
                        borderRadius: "10px",
                        background:
                            !isDirty || !isValid
                                ? "#cbd5e1"
                                : "#2563eb",
                        color: "#ffffff",
                        font: "inherit",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor:
                            !isDirty || !isValid
                                ? "not-allowed"
                                : "pointer",
                        boxShadow:
                            !isDirty || !isValid
                                ? "none"
                                : "0 4px 12px rgba(37, 99, 235, 0.18)",
                        transition: "all 150ms ease",
                    }}
                >
                    {editing
                        ? "บันทึกการแก้ไข"
                        : "เพิ่มสินค้า"}
                </button>
            </div>
        </form>
    );
}