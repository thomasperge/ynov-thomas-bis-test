import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}

export function Toast({
  message,
  type = "success",
}: {
  message: string;
  type?: "success" | "error";
}) {
  return (
    <div className={`toast ${type}`} data-testid="toast" role="alert">
      {message}
    </div>
  );
}
