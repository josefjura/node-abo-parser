import { expect } from 'chai'
import { ABOHeaderParser, Parser, GroupHeaderParser, FileHeaderParser, RecordParser } from '../classes'

describe('Row', () => {
    describe('by size', () => {
        it('throws on empty value', () => {
            var row = new Parser();
            row.start(null);
            expect(() => row.readByLength(1)).to.throw('EMPTY');
        })
        it('throws on length less than one', () => {
            var row = new Parser();
            row.start('test');
            expect(() => row.readByLength(0)).to.throw('BAD_LENGTH');
        })
        it('throws on length bigger than value length', () => {
            var row = new Parser();
            row.start('test');
            expect(() => row.readByLength(5)).to.throw('TOO_LONG');
        })
        it('reads some values', () => {
            var row = new Parser();
            row.start("122333");
            row.readByLength(1);
            row.readByLength(2);
            row.readByLength(3);
            expect(row.rawData.length).to.equal(3);
            expect(row.rawData[0]).to.equal("1");
            expect(row.rawData[1]).to.equal("22");
            expect(row.rawData[2]).to.equal("333");
        })
    })
    describe('by delimiter', () => {
        it('throws on empty value', () => {
            var row = new Parser();
            row.start(null);
            expect(() => row.readByDelimiter(' ')).to.throw('EMPTY');
        })
        it('throws on length less than one', () => {
            var row = new Parser();
            row.start('test');
            expect(() => row.readByDelimiter(null)).to.throw('BAD_DELIMITER');
        })
        it('reads all in case of missing delimiter', () => {
            var row = new Parser();
            row.start('all_the_stuff');
            expect(() => row.readByDelimiter(' ')).to.not.throw();
            expect(row.rawData.length).to.equal(1);
            expect(row.rawData[0]).to.equal('all_the_stuff');
        })
        it('reads some values', () => {
            var row = new Parser();
            row.start("1 22 333|4444");
            row.readByDelimiter(' ');
            row.readByDelimiter(' ');
            row.readByDelimiter('|');
            row.readByDelimiter(' ');
            expect(row.rawData.length).to.equal(4);
            expect(row.rawData[0]).to.equal("1");
            expect(row.rawData[1]).to.equal("22");
            expect(row.rawData[2]).to.equal("333");
            expect(row.rawData[3]).to.equal("4444");
        })
    })
    describe('to end', () => {
        it('throws on empty value', () => {
            var row = new Parser();
            row.start(null);
            expect(() => row.readByDelimiter(' ')).to.throw('EMPTY');
        })
        it('reads some values', () => {
            var row = new Parser();
            row.start("11xxxx");
            row.readByLength(2);
            row.readToEnd();
            expect(row.rawData.length).to.equal(2);
            expect(row.rawData[0]).to.equal("11");
            expect(row.rawData[1]).to.equal("xxxx");
        })
    })
})

describe('ABOHeader', () => {
    it('throws error on empty', () => {
        var header = new ABOHeaderParser();
        expect(() => header.parse(null)).to.throw('EMPTY');
    })
    it('throws error on bad length', () => {
        var header = new ABOHeaderParser();
        expect(() => header.parse('123456789')).to.throw('BAD HEADER LENGTH');
    })
    it('parses real values to raw data', () => {
        var header = new ABOHeaderParser();

        var stuff = 'UHL1141118                    1234567890001999111111222222'
        expect(() => header.parse(stuff)).to.not.throw();
        expect(header.datum).to.equal('141118');
        expect(header.nazev_prikazce).to.equal('                    ');
        expect(header.cislo_klienta).to.equal('1234567890');
    })
})

describe('FileHeader', () => {
    it('throws error on empty', () => {
        var header = new FileHeaderParser();
        expect(() => header.parse(null)).to.throw('EMPTY');
    })
    it('parses real values to raw data', () => {
        var header = new FileHeaderParser();

        var stuff = '1 1501 111111 5500'
        expect(() => header.parse(stuff)).to.not.throw();
        expect(header.druh).to.equal('1501');
        expect(header.kod_banky_prikazce).to.equal('5500');
        expect(header.pobocka_banky).to.equal('111');
        expect(header.poradove_cislo).to.equal('111');
    })
})

describe('GroupHeader', () => {
    it('throws error on empty', () => {
        var header = new GroupHeaderParser();
        expect(() => header.parse(null)).to.throw('EMPTY');
    })
    it('parses real values to raw data', () => {
        var header = new GroupHeaderParser();

        var stuff = '2 000000-6206855001 1253400 231218'
        expect(() => header.parse(stuff)).to.not.throw();
        expect(header.prikazce).to.equal('000000-6206855001');
        expect(header.suma).to.equal('1253400');
        expect(header.splatnost).to.equal('231218');
    })
})

describe('Record', () => {
    it('throws error on empty', () => {
        var record = new RecordParser();
        expect(() => record.parse(null)).to.throw('EMPTY');
    })
    it('parses real values to raw data', () => {
        var record = new RecordParser();

        var stuff = '000705-0077627231 1253400 8511271362 07101148'
        expect(() => record.parse(stuff)).to.not.throw();
        expect(record.protistrana).to.equal('000705-0077627231');
        expect(record.castka).to.equal('1253400');
        expect(record.vsym).to.equal('8511271362');
        expect(record.kod_banky).to.equal('0710');
        expect(record.ksym).to.equal('1148');
    })
})