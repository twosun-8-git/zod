import Link from "next/link";

export default function Page() {
  return (
    <table>
      <tbody>
        <tr>
          <th>
            <Link href="./basic">basic</Link>
          </th>
          <td>Zodの基本的な使い方</td>
        </tr>
        <tr>
          <th>
            <Link href="./sync">sync</Link>
          </th>
          <td>
            メールアドレスのクロスフィールドバリデーションの発火タイミング修正
          </td>
        </tr>
      </tbody>
    </table>
  );
}
