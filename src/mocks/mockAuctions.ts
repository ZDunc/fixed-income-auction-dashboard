import type { Auction } from '../interfaces/Auction';

const now = Date.now();

const toNanoseconds = (milliseconds: number) =>
    milliseconds * 1_000_000;

const minutesFromNow = (minutes: number) =>
    toNanoseconds(now + minutes * 60_000);

export const mockAuctions: Auction[] = [
    {
        id: 1001,
        cusip: '17275RAB4',
        side: 'Bid',
        size: 2_500_000,
        price: 99.875,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-45),
        expirationTimestamp: minutesFromNow(180),
        conclusionTimestamp: null
    },
    {
        id: 1002,
        cusip: '46647PBY1',
        side: 'Offer',
        size: 1_750_000,
        price: 101.125,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-30),
        expirationTimestamp: minutesFromNow(120),
        conclusionTimestamp: null
    },
    {
        id: 1003,
        cusip: '594918CM2',
        side: 'Bid',
        size: 5_000_000,
        price: 98.625,
        productType: 'Municipal',
        curtainTimestamp: minutesFromNow(90),
        expirationTimestamp: minutesFromNow(300),
        conclusionTimestamp: null
    },
    {
        id: 1004,
        cusip: '037833DV9',
        side: 'Offer',
        size: 3_250_000,
        price: 102.375,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-240),
        expirationTimestamp: minutesFromNow(60),
        conclusionTimestamp: minutesFromNow(-20)
    },
    {
        id: 1005,
        cusip: '91282CJL6',
        side: 'Bid',
        size: 4_000_000,
        price: 97.75,
        productType: 'Municipal',
        curtainTimestamp: minutesFromNow(-360),
        expirationTimestamp: minutesFromNow(-45),
        conclusionTimestamp: null
    },
    {
        id: 1006,
        cusip: '02079KAD9',
        side: 'Offer',
        size: 1_000_000,
        price: 100.5,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-75),
        expirationTimestamp: minutesFromNow(90),
        conclusionTimestamp: null
    },
    {
        id: 1007,
        cusip: '30303MAB7',
        side: 'Bid',
        size: 7_500_000,
        price: 103.125,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(150),
        expirationTimestamp: minutesFromNow(420),
        conclusionTimestamp: null
    },
    {
        id: 1008,
        cusip: '38141GZN8',
        side: 'Offer',
        size: 2_250_000,
        price: 96.875,
        productType: 'Municipal',
        curtainTimestamp: minutesFromNow(-180),
        expirationTimestamp: minutesFromNow(45),
        conclusionTimestamp: minutesFromNow(-5)
    },
    {
        id: 1009,
        cusip: '06051GKM4',
        side: 'Bid',
        size: 3_000_000,
        price: 99.25,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-20),
        expirationTimestamp: minutesFromNow(240),
        conclusionTimestamp: null
    },
    {
        id: 1010,
        cusip: '61747YEF8',
        side: 'Offer',
        size: 6_000_000,
        price: 104.625,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-300),
        expirationTimestamp: minutesFromNow(-90),
        conclusionTimestamp: null
    },
    {
        id: 1011,
        cusip: '78462FBR9',
        side: 'Bid',
        size: 1_500_000,
        price: 100.125,
        productType: 'Municipal',
        curtainTimestamp: minutesFromNow(45),
        expirationTimestamp: minutesFromNow(200),
        conclusionTimestamp: null
    },
    {
        id: 1012,
        cusip: '22160KAL7',
        side: 'Offer',
        size: 2_750_000,
        price: null,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-55),
        expirationTimestamp: minutesFromNow(150),
        conclusionTimestamp: null
    },
    {
        id: 1013,
        cusip: '254687GK8',
        side: 'Bid',
        size: 8_000_000,
        price: 101.875,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-210),
        expirationTimestamp: minutesFromNow(30),
        conclusionTimestamp: minutesFromNow(-35)
    },
    {
        id: 1014,
        cusip: '3133EPAB2',
        side: 'Offer',
        size: 900_000,
        price: 98.375,
        productType: 'Municipal',
        curtainTimestamp: minutesFromNow(-25),
        expirationTimestamp: minutesFromNow(80),
        conclusionTimestamp: null
    },
    {
        id: 1015,
        cusip: '459200KV3',
        side: 'Bid',
        size: 4_500_000,
        price: 102.25,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(240),
        expirationTimestamp: minutesFromNow(480),
        conclusionTimestamp: null
    },
    {
        id: 1016,
        cusip: '478160DN5',
        side: 'Offer',
        size: 3_750_000,
        price: 99.625,
        productType: 'Municipal',
        curtainTimestamp: minutesFromNow(-480),
        expirationTimestamp: minutesFromNow(-120),
        conclusionTimestamp: null
    },
    {
        id: 1017,
        cusip: '742718FG1',
        side: 'Bid',
        size: 2_000_000,
        price: 100.875,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-10),
        expirationTimestamp: minutesFromNow(110),
        conclusionTimestamp: null
    },
    {
        id: 1018,
        cusip: '857477CL4',
        side: 'Offer',
        size: 5_500_000,
        price: 103.5,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-150),
        expirationTimestamp: minutesFromNow(70),
        conclusionTimestamp: minutesFromNow(-15)
    },
    {
        id: 1019,
        cusip: '92826CAF2',
        side: 'Bid',
        size: 1_250_000,
        price: 97.125,
        productType: 'Municipal',
        curtainTimestamp: minutesFromNow(120),
        expirationTimestamp: minutesFromNow(360),
        conclusionTimestamp: null
    },
    {
        id: 1020,
        cusip: '931142ER8',
        side: 'Offer',
        size: 3_500_000,
        price: 101.625,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-35),
        expirationTimestamp: minutesFromNow(190),
        conclusionTimestamp: null
    },
    {
        id: 1021,
        cusip: '94974BGT6',
        side: 'Bid',
        size: 6_250_000,
        price: 98.875,
        productType: 'Municipal',
        curtainTimestamp: minutesFromNow(-420),
        expirationTimestamp: minutesFromNow(-60),
        conclusionTimestamp: null
    },
    {
        id: 1022,
        cusip: '023135CE4',
        side: 'Offer',
        size: 2_400_000,
        price: 100.375,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(-65),
        expirationTimestamp: minutesFromNow(135),
        conclusionTimestamp: null
    },
    {
        id: 1023,
        cusip: '20030NAB1',
        side: 'Bid',
        size: 4_750_000,
        price: null,
        productType: 'Corporate',
        curtainTimestamp: minutesFromNow(60),
        expirationTimestamp: minutesFromNow(260),
        conclusionTimestamp: null
    },
    {
        id: 1024,
        cusip: '14913QBC5',
        side: 'Offer',
        size: 1_800_000,
        price: 102.75,
        productType: 'Municipal',
        curtainTimestamp: minutesFromNow(-280),
        expirationTimestamp: minutesFromNow(20),
        conclusionTimestamp: minutesFromNow(-40)
    }
];