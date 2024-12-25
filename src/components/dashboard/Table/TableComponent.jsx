import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

export default function TableComponent() {
  return (
    <Table isStriped aria-label="Comprehensive Balance Sheet for 5 Periods">
      <TableHeader>
        <TableColumn>HESAP KALEMİ</TableColumn>
        <TableColumn>Q3</TableColumn>
        <TableColumn>Q2</TableColumn>
        <TableColumn>Q1</TableColumn>
        <TableColumn>Q4</TableColumn>
        <TableColumn>Q3 (Previous Year)</TableColumn>
      </TableHeader>
      <TableBody>
        {/* Dönen Varlıklar */}
        <TableRow key="1">
          <TableCell>Nakit ve Nakit Benzerleri</TableCell>
          <TableCell>200,000</TableCell>
          <TableCell>180,000</TableCell>
          <TableCell>220,000</TableCell>
          <TableCell>190,000</TableCell>
          <TableCell>150,000</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>Banka Mevduatları</TableCell>
          <TableCell>75,000</TableCell>
          <TableCell>80,000</TableCell>
          <TableCell>70,000</TableCell>
          <TableCell>60,000</TableCell>
          <TableCell>50,000</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Ticari Alacaklar</TableCell>
          <TableCell>280,000</TableCell>
          <TableCell>300,000</TableCell>
          <TableCell>320,000</TableCell>
          <TableCell>310,000</TableCell>
          <TableCell>300,000</TableCell>
        </TableRow>
        <TableRow key="4">
          <TableCell>Stoklar</TableCell>
          <TableCell>450,000</TableCell>
          <TableCell>430,000</TableCell>
          <TableCell>400,000</TableCell>
          <TableCell>420,000</TableCell>
          <TableCell>500,000</TableCell>
        </TableRow>

        {/* Duran Varlıklar */}
        <TableRow key="5">
          <TableCell>Maddi Duran Varlıklar</TableCell>
          <TableCell>1,200,000</TableCell>
          <TableCell>1,150,000</TableCell>
          <TableCell>1,100,000</TableCell>
          <TableCell>1,050,000</TableCell>
          <TableCell>1,000,000</TableCell>
        </TableRow>
        <TableRow key="6">
          <TableCell>Maddi Olmayan Duran Varlıklar</TableCell>
          <TableCell>350,000</TableCell>
          <TableCell>340,000</TableCell>
          <TableCell>330,000</TableCell>
          <TableCell>320,000</TableCell>
          <TableCell>300,000</TableCell>
        </TableRow>
        <TableRow key="7">
          <TableCell>Finansal Yatırımlar</TableCell>
          <TableCell>500,000</TableCell>
          <TableCell>520,000</TableCell>
          <TableCell>530,000</TableCell>
          <TableCell>510,000</TableCell>
          <TableCell>400,000</TableCell>
        </TableRow>

        {/* Kısa Vadeli Yükümlülükler */}
        <TableRow key="8">
          <TableCell>Kısa Vadeli Borçlar</TableCell>
          <TableCell>380,000</TableCell>
          <TableCell>390,000</TableCell>
          <TableCell>370,000</TableCell>
          <TableCell>360,000</TableCell>
          <TableCell>400,000</TableCell>
        </TableRow>
        <TableRow key="9">
          <TableCell>Ticari Borçlar</TableCell>
          <TableCell>300,000</TableCell>
          <TableCell>310,000</TableCell>
          <TableCell>290,000</TableCell>
          <TableCell>280,000</TableCell>
          <TableCell>250,000</TableCell>
        </TableRow>

        {/* Uzun Vadeli Yükümlülükler */}
        <TableRow key="10">
          <TableCell>Uzun Vadeli Borçlar</TableCell>
          <TableCell>550,000</TableCell>
          <TableCell>570,000</TableCell>
          <TableCell>580,000</TableCell>
          <TableCell>590,000</TableCell>
          <TableCell>600,000</TableCell>
        </TableRow>

        {/* Özkaynaklar */}
        <TableRow key="11">
          <TableCell>Ödenmiş Sermaye</TableCell>
          <TableCell>1,000,000</TableCell>
          <TableCell>1,000,000</TableCell>
          <TableCell>1,000,000</TableCell>
          <TableCell>1,000,000</TableCell>
          <TableCell>1,000,000</TableCell>
        </TableRow>
        <TableRow key="12">
          <TableCell>Dönem Net Karı/Zararı</TableCell>
          <TableCell>170,000</TableCell>
          <TableCell>180,000</TableCell>
          <TableCell>160,000</TableCell>
          <TableCell>150,000</TableCell>
          <TableCell>140,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
