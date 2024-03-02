import { Helmet } from 'react-helmet-async';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import DataWidget from 'src/components/widgets/DataWidget';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useFetcher } from 'src/api/fetcher';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Label from 'src/components/label/Label';
import moment from 'moment';
const MONTHS = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};
function years() {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = 2023; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
}
// ----------------------------------------------------------------------

const headLabel = [
  'No',
  'Name',
  'Fee Category',
  'Payment Method',
  'Amount',
  'Status',
  'Date',
];

const PaymentsReport = () => {
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    isYearly: false,
  });
  const { data, isError, isLoading } = useFetcher(
    `/payment?status=Success&date=${JSON.stringify(date)}`,
  );

  const payments = useMemo(() => {
    return data?.data || [];
  }, [data?.data]);

  const exportPDF = () => {
    const unit = 'mm';
    const size = 'A4';
    const orientation = 'portrait';

    const marginLeft = 10;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const data = payments.map(
      (
        {
          paidBy,
          paymentPlan,
          paymentMethod,
          amountPaid,
          transactionStatus,
          createdAt,
        },
        index,
      ) => {
        const name = paidBy?.name || 'Deleted Member';
        const formatter = new Intl.NumberFormat('en-RW', {
          style: 'currency',
          currency: 'RWF',
          currencyDisplay: 'symbol',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
        const formattedValue = formatter
          .format(amountPaid)
          .replace('RF', '');
        const amount = formattedValue.replace('RWF', '').trim();
        const formattedAmount = `${amount} Rwf`;

        return [
          index + 1,
          name,
          paymentPlan === 'Application Fee'
            ? paymentPlan
            : 'Licensing Fee | ' + paymentPlan,
          paymentMethod == 'Card' ? 'Bank Card' : 'Mobile Money',
          formattedAmount,
          transactionStatus === 'Success'
            ? 'Paid'
            : transactionStatus,
          createdAt,
        ];
      },
    );

    let content = {
      startY: 20,
      headStyles: {
        fillColor: '#008D41',
      },
      head: [
        [
          'No',
          'Name',
          'Fee Category',
          'Payment Method',
          'Amount',
          'Status',
          'Date',
        ],
      ],
      body: data,
      willDrawCell: function (data) {
        var doc = data.doc;
        var rows = data.table.body;
        if (rows.length === 1) {
        } else if (data.row.index === rows.length - 1) {
          // doc.setFontStyle('bold');
          doc.setFontSize('10');
          doc.setFillColor(255, 255, 255);
        }
      },
    };

    doc.text(
      `PAID APPLICATION AND LICENSING FEES (RUPI) FOR ${
        date.isYearly ? 'YEAR' : MONTHS[date.month].toUpperCase()
      } ${date.year}`,
      marginLeft + 4,
      15,
    );

    doc.autoTable(content);

    const pageCount = doc.internal.getNumberOfPages();
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        'Page ' + String(i) + ' of ' + String(pageCount),
        210 - 20,
        297 - 10,
        null,
        null,
        'right',
      );
    }
    doc.save(
      `Paid Application and Licensing Fees (RUPI) - ${
        date.isYearly ? '' : MONTHS[date.month]
      } ${date.year}.pdf`,
    );
  };

  return (
    <>
      <Helmet>
        <title> Finance Reports | MUGEMA Registrar </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          // sx={{ my: 0 }}
          justifyContent="space-between"
        >
          <Typography variant="h4">Payments Report</Typography>
        </Stack>
        <Stack justifyContent="end" direction={'row'} sx={{ my: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              labelId="select"
              id="select"
              value={date.month}
              onChange={e =>
                setDate(prev => ({
                  ...prev,
                  month: e.target.value,
                }))
              }
              label="Select "
              disabled={date.isYearly}
              required
              input={<OutlinedInput />}
            >
              {Object.keys(MONTHS).map((i, index) => {
                return (
                  <MenuItem value={i} key={index}>
                    {MONTHS[i]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120, mx: 2 }}>
            <Select
              labelId="select"
              id="select"
              value={date.year}
              onChange={e =>
                setDate(prev => ({
                  ...prev,
                  year: e.target.value,
                }))
              }
              label="Select "
              required
              input={<OutlinedInput />}
            >
              {years().map((year, index) => {
                return (
                  <MenuItem value={year} key={index}>
                    {year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              labelId="select"
              id="select"
              value={date.isYearly}
              onChange={e =>
                setDate(prev => ({
                  ...prev,
                  isYearly: e.target.value,
                }))
              }
              label="Select "
              required
              input={<OutlinedInput />}
            >
              {[0, 1].map((label, index) => {
                return (
                  <MenuItem value={label === 0} key={index}>
                    {label === 0 ? 'Annually' : 'Monthly'}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Button
            variant="contained"
            sx={{ m: 2, mt: 0 }}
            onClick={() => exportPDF()}
            disabled={!payments.length}
          >
            Download PDF Report
          </Button>
        </Stack>
        <DataWidget
          title={'Payments'}
          isLoading={isLoading && !payments.length && !isError}
          isError={
            !isLoading && !payments.length && isError ? isError : null
          }
          isEmpty={!isLoading && !payments.length && !isError}
          customEmptyMessage={`There are no payments available in this ${
            date.isYearly
              ? 'year, ' + date.year
              : 'month. ' + MONTHS[date.month] + ', ' + date.year
          }`}
        >
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {headLabel.map((headCell, index) => (
                        <TableCell
                          key={index}
                          align={'left'}
                          sortDirection={false}
                        >
                          {headCell}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((row, index) => {
                      const {
                        id,
                        paymentPlan,
                        paymentMethod,
                        transactionStatus,
                        createdAt,
                        amountPaid,
                        paidBy,
                      } = row;

                      const name = paidBy?.name;
                      const formatter = new Intl.NumberFormat(
                        'en-RW',
                        {
                          style: 'currency',
                          currency: 'RWF',
                          currencyDisplay: 'symbol',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        },
                      );

                      const formattedValue = formatter
                        .format(amountPaid)
                        .replace('RF', '');
                      const amount = formattedValue
                        .replace('RWF', '')
                        .trim();

                      const formattedAmount = `${amount}  Rwf`;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {name || 'Deleted Member'}
                            </Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {paymentPlan === 'Application Fee'
                                ? paymentPlan
                                : 'Licensing Fee | ' + paymentPlan}
                            </Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {paymentMethod == 'Card'
                                ? 'Bank Card'
                                : 'Mobile Money'}
                            </Typography>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography variant="subtitle2" noWrap>
                              {formattedAmount}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">
                            <Label
                              color={
                                transactionStatus === 'Pending'
                                  ? 'success'
                                  : transactionStatus === 'Success'
                                  ? 'success'
                                  : 'error'
                              }
                            >
                              {transactionStatus === 'Pending'
                                ? 'Pending'
                                : transactionStatus === 'Success'
                                ? 'Paid'
                                : 'Not Paid'}
                            </Label>
                          </TableCell>

                          <TableCell align="left">
                            {createdAt}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
        </DataWidget>
      </Container>
    </>
  );
};
export default PaymentsReport;
