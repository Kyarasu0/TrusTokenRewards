export async function Submit(
  path: string,
  userId: string,
  password: string,
  showToast: (msg: string) => void
) {

  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, password })
  });

  const data = await res.json();

  if (!res.ok) {
    showToast(data.message || "エラーが発生しました");
    throw new Error(data.message || "Error");
  }

  // 成功時もmessageがあれば表示
  if (data.message) {
    showToast(data.message);
  }

  return data;
}