import { useEffect, useRef, useState } from 'react';
import { Box, TextField } from '@mui/material';
import $ from 'jquery';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'bootstrap-daterangepicker';
import moment from 'moment';

const TimeFilter = ({ timeFilter, dateRange, onChange }) => {
    const datePickerRef = useRef(null);

    const [displayValue, setDisplayValue] = useState("");

    useEffect(() => {
        const todayStart = moment().startOf("day");
        const todayEnd = moment().endOf("day");

        setDisplayValue(`${todayStart.format("MMM D, YYYY")} - ${todayEnd.format("MMM D, YYYY")}`);

        // Notify parent
        onChange({
            timeFilter: "TODAY",
            dateRange: { startDate: todayStart.toDate(), endDate: todayEnd.toDate() }
        });
    }, []); // run ONCE

    useEffect(() => {
        if (!datePickerRef.current) return;

        $(datePickerRef.current).daterangepicker(
            {
                startDate: moment(dateRange?.startDate) || moment(),
                endDate: moment(dateRange?.endDate) || moment(),
                autoUpdateInput: false, // ❗ prevent plugin from forcing wrong date
                opens: 'left',
                locale: { format: 'MMM D, YYYY' },
                ranges: {
                    Today: [moment(), moment()],
                    Yesterday: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [
                        moment().subtract(1, 'month').startOf('month'),
                        moment().subtract(1, 'month').endOf('month')
                    ],
                    'All Time': [moment('2000-01-01'), moment()],
                },
            },
            (start, end, label) => {
                // Update TextField
                setDisplayValue(
                    `${start.format("MMM D, YYYY")} - ${end.format("MMM D, YYYY")}`
                );

                const rangeMap = {
                    Today: "TODAY",
                    Yesterday: "YESTERDAY",
                    'Last 7 Days': "WEEK",
                    'Last 30 Days': "MONTH",
                    'This Month': "MONTH",
                    'Last Month': "MONTH",
                    'All Time': "ALL"
                };

                onChange({
                    timeFilter: rangeMap[label] || "CUSTOM",
                    dateRange: { startDate: start.toDate(), endDate: end.toDate() },
                });
            }
        );
    }, [dateRange, onChange]);

    return (
        <Box sx={{ mb: 3, mt: 3 }}>
            <TextField
                inputRef={datePickerRef}
                value={displayValue}
                label="Date Range"
                size="small"
                sx={{ minWidth: 260, '& input': { cursor: 'pointer' } }}
                InputProps={{ readOnly: true }}
            />
        </Box>
    );
};

export default TimeFilter;
