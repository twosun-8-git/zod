import Link from "next/link";

export default function Page() {
  return (
    <table>
      <tbody>
        <tr>
          <th>
            <Link href="./basic">basic</Link>
          </th>
          <td>zodの基本的な使い方</td>
        </tr>
        <tr>
          <th>
            <Link href="./sync">sync</Link>
          </th>
          <td>クロスフィールドバリデーションを同時発火</td>
        </tr>
      </tbody>
    </table>
  );
}
