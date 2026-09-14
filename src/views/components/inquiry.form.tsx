import { Button, Card, Input, Select } from "@/views/components/ui/index.js";
import type { Product } from "@/views/utils.js";

interface InquiryFormProps {
  products: Product[];
  selectedProduct: string;
  customerId: string;
  onChangeProduct: (code: string) => void;
  onChangeCustomerId: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function InquiryForm({
  products,
  selectedProduct,
  customerId,
  onChangeProduct,
  onChangeCustomerId,
  onSubmit,
  isLoading,
}: InquiryFormProps) {
  return (
    <div className="lg:col-span-5 flex flex-col gap-5 h-full">
      <Card className="p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-black/[0.05]">
          <span className="w-6 h-6 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center text-xs font-bold">
            1
          </span>
          <h2 className="text-sm font-bold tracking-tight text-ink-900">
            Form Inquiry Tagihan
          </h2>
        </div>

        <form
          id="form-inquiry"
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Select
            id="product-select"
            label="Pilih Wilayah PDAM"
            value={selectedProduct}
            onChange={(e) =>
              onChangeProduct((e.target as HTMLSelectElement).value)
            }
          >
            {products.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name} ({p.code})
              </option>
            ))}
          </Select>

          <Input
            id="customer-id-input"
            label="Nomor ID Pelanggan"
            type="text"
            value={customerId}
            onInput={(e) =>
              onChangeCustomerId((e.target as HTMLInputElement).value)
            }
            placeholder="Contoh: 01002676"
            className="font-mono"
            required
          />

          <Button
            type="submit"
            id="btn-submit-inquiry"
            variant="default"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Cek Tagihan
          </Button>
        </form>
      </Card>

      {/* Preset Cards */}
      <Card className="p-5 flex-1 flex flex-col justify-start">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-800/40 mb-3">
          ID Pelanggan Contoh
        </p>
        <div id="preset-buttons" className="space-y-2">
          {products.map((p) => (
            <button
              key={p.code}
              type="button"
              onClick={() => {
                onChangeProduct(p.code);
                onChangeCustomerId(p.defaultIdpel);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left bg-mist-50 hover:bg-mist-100/80 border border-black/[0.06] transition-all group cursor-pointer"
            >
              <div className="min-w-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {p.code.slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <span className="block text-[12px] font-semibold text-ink-900 group-hover:text-accent-600 transition-colors truncate">
                    {p.name} ({p.code})
                  </span>
                  <span className="block text-[11px] font-mono text-ink-800/50">
                    IDPEL:{" "}
                    <span className="text-ink-900 font-semibold">
                      {p.defaultIdpel}
                    </span>
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-accent-600 opacity-80 group-hover:opacity-100 shrink-0">
                Pilih →
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
