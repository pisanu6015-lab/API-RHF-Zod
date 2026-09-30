"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "../lib/products";
import type { Product, ProductList, SearchQuery } from "../lib/products";
import ProductSearchForm from "./Productsearchform";
import ProductForm from "./Productform";

type ProductDraft = Omit<Product, "id">;

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => {
    loadProducts(defaultQuery);
  }, []);

  function saveProduct(draft: ProductDraft) {
    if (editingProduct) {
      setProducts(
        products.map((item) =>
          item.id === editingProduct.id
            ? { ...item, ...draft }
            : item
        )
      );

      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...draft,
      };

      setProducts([...products, newProduct]);
    }

    setStatus("ready");
  }

  function removeProduct(id: number) {
    setProducts(products.filter((item) => item.id !== id));

    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
  }

  function handleCancel() {
    setEditingProduct(null);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030808",
        padding: "40px 20px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1250,
          margin: "0 auto",
        }}
      >
        <header
          style={{
            background: "#ffffff",
            padding: "28px 32px",
            borderRadius: 18,
            marginBottom: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 25,
              }}
            >
              🛒
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 750,
                  color: "#0f172a",
                }}
              >
                ระบบจัดการสินค้า
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748b",
                  fontSize: 15,
                }}
              >
                จัดการ ค้นหา แก้ไข และลบข้อมูลสินค้า
              </p>
            </div>
          </div>
        </header>

        <section
          style={{
            background: "#ffffff",
            padding: 28,
            borderRadius: 18,
            marginBottom: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: editingProduct
                  ? "#fff7ed"
                  : "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              {editingProduct ? "✏️" : "➕"}
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: "#0f172a",
                }}
              >
                {editingProduct
                  ? "แก้ไขข้อมูลสินค้า"
                  : "เพิ่มสินค้าใหม่"}
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 14,
                  color: "#64748b",
                }}
              >
                {editingProduct
                  ? "แก้ไขรายละเอียดของสินค้าที่เลือก"
                  : "กรอกข้อมูลเพื่อเพิ่มสินค้าเข้าสู่ระบบ"}
              </p>
            </div>
          </div>

          <ProductForm
            key={editingProduct ? editingProduct.id : "new"}
            editing={editingProduct}
            onSave={saveProduct}
            onCancel={handleCancel}
          />
        </section>

        <section
          style={{
            background: "#ffffff",
            padding: 28,
            borderRadius: 18,
            marginBottom: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🔎
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: "#0f172a",
                }}
              >
                ค้นหาสินค้า
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 14,
                  color: "#64748b",
                }}
              >
                ค้นหาสินค้าตามเงื่อนไขที่ต้องการ
              </p>
            </div>
          </div>

          <ProductSearchForm onSearch={loadProducts} />
        </section>

        <section
          style={{
            background: "#ffffff",
            padding: 28,
            borderRadius: 18,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: "#0f172a",
                }}
              >
                รายการสินค้า
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                ข้อมูลสินค้าทั้งหมดในระบบ
              </p>
            </div>

            <div
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                background: "#eff6ff",
                color: "#2563eb",
                fontSize: 14,
                fontWeight: 650,
              }}
            >
              {products.length} รายการ
            </div>
          </div>

          {status === "idle" && (
            <div
              style={{
                padding: 30,
                textAlign: "center",
                background: "#f8fafc",
                borderRadius: 12,
                color: "#64748b",
              }}
            >
              กรอกข้อมูลและคลิกปุ่มค้นหาเพื่อเริ่ม
            </div>
          )}

          {status === "loading" && (
            <div
              style={{
                padding: 30,
                textAlign: "center",
                background: "#eff6ff",
                borderRadius: 12,
                color: "#2563eb",
                fontWeight: 600,
              }}
            >
              ⏳ กำลังโหลดข้อมูล...
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              style={{
                padding: 16,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 12,
                color: "#b91c1c",
              }}
            >
              ❌ {errorMessage}
            </div>
          )}

          {status === "ready" && products.length === 0 && (
            <div
              style={{
                padding: 30,
                textAlign: "center",
                background: "#f8fafc",
                borderRadius: 12,
                color: "#64748b",
              }}
            >
              📦 ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </div>
          )}

          {status === "ready" && products.length > 0 && (
            <div
              style={{
                overflowX: "auto",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  minWidth: 1050,
                }}
              >
                <thead>
                  <tr>
                    {[
                      "รูปภาพ",
                      "ชื่อสินค้า",
                      "ราคา",
                      "คงเหลือ",
                      "หมวดหมู่",
                      "รายละเอียด",
                      "คะแนน",
                      "ส่วนลด (%)",
                      "จัดการ",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: "15px 14px",
                          background: "#f8fafc",
                          color: "#475569",
                          fontSize: 13,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          borderBottom:
                            "1px solid #e2e8f0",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {products.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom:
                          "1px solid #f1f5f9",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px",
                        }}
                      >
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{
                              width: 58,
                              height: 58,
                              objectFit: "cover",
                              borderRadius: 10,
                              border:
                                "1px solid #e2e8f0",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 58,
                              height: 58,
                              borderRadius: 10,
                              background:
                                "#f1f5f9",
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              color: "#94a3b8",
                            }}
                          >
                            📦
                          </div>
                        )}
                      </td>

                      <td
                        style={{
                          padding: "14px",
                          fontWeight: 650,
                          color: "#0f172a",
                        }}
                      >
                        {item.title}
                      </td>

                      <td
                        style={{
                          padding: "14px",
                          whiteSpace: "nowrap",
                          fontWeight: 600,
                          color: "#2563eb",
                        }}
                      >
                        ฿{item.price}
                      </td>

                      <td
                        style={{
                          padding: "14px",
                        }}
                      >
                        <span
                          style={{
                            padding:
                              "5px 9px",
                            borderRadius: 8,
                            background:
                              item.stock > 10
                                ? "#dcfce7"
                                : "#fef3c7",
                            color:
                              item.stock > 10
                                ? "#15803d"
                                : "#a16207",
                            fontSize: 13,
                            fontWeight: 650,
                          }}
                        >
                          {item.stock}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "14px",
                        }}
                      >
                        <span
                          style={{
                            padding:
                              "5px 10px",
                            borderRadius: 20,
                            background:
                              "#f1f5f9",
                            color: "#475569",
                            fontSize: 13,
                          }}
                        >
                          {item.category}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "14px",
                          minWidth: 220,
                          maxWidth: 300,
                          color: "#64748b",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </td>

                      <td
                        style={{
                          padding: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ⭐ {item.rating}
                      </td>

                      <td
                        style={{
                          padding: "14px",
                          whiteSpace: "nowrap",
                          color: "#dc2626",
                          fontWeight: 650,
                        }}
                      >
                        {item.discountPercentage}%
                      </td>

                      <td
                        style={{
                          padding: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct(item)
                          }
                          style={{
                            marginRight: 8,
                            padding:
                              "8px 13px",
                            border: "none",
                            borderRadius: 8,
                            background:
                              "#2563eb",
                            color: "#ffffff",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          ✏️ แก้ไข
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeProduct(item.id)
                          }
                          style={{
                            padding: "8px 13px",
                            border: "none",
                            borderRadius: 8,
                            background: "#fee2e2",
                            color: "#b91c1c",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          🗑️ ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}