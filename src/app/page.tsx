"use client";
import { useState } from "react";
import { z, ZodError } from "zod";

// Reference: https://zod.dev/?id=primitives

const FormSchema = z
  .object({
    fullName: z
      .string({
        required_error: "名前を入力してください",
        invalid_type_error: "入力が正しくないようです",
      })
      .min(2, { message: "2文字以上入力してください" }),
    age: z
      .number({
        required_error: "年齢を入力してください",
        invalid_type_error: "半角数字で入力してください",
      })
      .min(1, { message: "1以上を入力してください" })
      .int({ message: "年齢は正数で入力してください" }),
    gender: z.enum(["female", "male", "other"], {
      required_error: "性別を選択してください",
    }),
    birthday: z
      .string({ required_error: "生年月日を入力してください" })
      .pipe(z.coerce.date()),
    email: z
      .string({
        required_error: "メールアドレスを入力してください",
      })
      .email({ message: "有効なメールアドレスを入力してください" }),
    confirmEmail: z
      .string({
        required_error: "確認用メールアドレスを入力してください",
      })
      .email({ message: "有効なメールアドレスを入力してください" }),
    url: z.string().url({ message: "有効なURLを入力してください" }).optional(),
    spouse: z.number({
      required_error: "選択してください",
      invalid_type_error: "入力形式が正しくありません",
    }),
    comment: z
      .string()
      .min(10, { message: "コメントは10文字以上で入力してください" })
      .max(30, { message: "コメントは30文字以内で入力してください" })
      .optional(),
    agree: z.coerce.boolean().refine((val) => val === true, {
      message: "利用規約に同意する必要があります",
    }),
  })
  // クロスフィールドバリデーション
  .refine((data) => data.email === data.confirmEmail, {
    message: "メールアドレスが一致しません",
    path: ["confirmEmail"], // エラーをconfirmEmailフィールドに関連付けそこにエラーメッセージを表示する
  });

type FormData = z.infer<typeof FormSchema>;
type FormErrors = { [K in keyof FormData]?: string[] };

export default function Home() {
  const [formData, setFormData] = useState<FormData | {}>({
    spouse: 1,
    agree: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, name, value, type } = e.target;
    const fieldName = id || name;

    // ""の場合はブラウザの初期値に戻す
    if (value === "") {
      setFormData((prev) => ({ ...prev, [fieldName]: undefined }));
      // valueが半角数字の場合はnumber型に変換（デフォルトでは "string" になるため）
    } else if (/^[0-9]+$/.test(value)) {
      setFormData((prev) => ({ ...prev, [fieldName]: Number(value) }));
      // type="checkbox"の場合はチェックされているかを判定する
    } else if (type === "checkbox") {
      const _checkbox = e.target as HTMLInputElement;
      const _isChecked = _checkbox.checked; // boolean
      setFormData((prev) => ({ ...prev, [fieldName]: _isChecked }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      // バリデーションに成功した場合の処理
      FormSchema.parse(formData);
      console.log(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.formErrors.fieldErrors);
        setErrors(error.formErrors.fieldErrors);
      }
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="form-group">
          <label htmlFor="fullName">名前</label>
          <div>
            <input id="fullName" type="text" onChange={handleChange} />
            {errors.fullName && (
              <span className="error-message">{errors.fullName[0]}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="age">年齢</label>
          <div>
            <input id="age" type="text" onChange={handleChange} />
            {errors.age && (
              <span className="error-message">{errors.age[0]}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="gender">性別</label>
          <div>
            <select id="gender" onChange={handleChange}>
              <option value="">選択してください</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="other">無回答</option>
            </select>
            {errors.gender && (
              <span className="error-message">{errors.gender[0]}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="birthday">生年月日</label>
          <div>
            <input id="birthday" type="date" onChange={handleChange} />
            {errors.birthday && (
              <span className="error-message">{errors.birthday[0]}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <div>
            <input id="email" type="text" onChange={handleChange} />
            {errors.email && (
              <span className="error-message">{errors.email[0]}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmEmail">メールアドレス（確認用）</label>
          <div>
            <input id="confirmEmail" type="text" onChange={handleChange} />
            {errors.confirmEmail && (
              <span className="error-message">{errors.confirmEmail[0]}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="url">URL</label>
          <div>
            <input id="url" type="text" onChange={handleChange} />
            {errors.url && (
              <span className="error-message">{errors.url[0]}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>配偶者</label>
          <div className="radio-group">
            <label>
              <input
                name="spouse"
                type="radio"
                value="1"
                defaultChecked // defaultCheckedだけでは値は渡らない
                onChange={handleChange}
              />
              あり
            </label>
            <label>
              <input
                name="spouse"
                type="radio"
                value="0"
                onChange={handleChange}
              />
              なし
            </label>
            {errors.spouse && (
              <span className="error-message">{errors.spouse[0]}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">自己紹介</label>
          <div>
            <textarea id="comment" onChange={handleChange}></textarea>
            {errors.comment && (
              <span className="error-message">{errors.comment[0]}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <div>
            <label>
              <input
                id="agree"
                type="checkbox"
                defaultChecked // defaultCheckedだけでは値は渡らない
                onChange={handleChange}
              />
              <span>利用規約に同意する</span>
            </label>
            {errors.agree && (
              <span className="error-message">{errors.agree[0]}</span>
            )}
          </div>
        </div>
        <div className="button-group">
          <button type="submit">送信</button>
          <button type="button">リセット</button>
        </div>
      </form>
    </main>
  );
}
