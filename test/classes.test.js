import { expect } from 'chai'
import { ABOHeader, Row, GroupHeader, FileHeader, Record } from '../classes'

describe('Row', () => {
    describe('by size', () => {
        it('throws on empty value', () => {
            var row = new Row();
            expect(() => row.readByLength(null, 1)).to.throw('EMPTY');
        })
        it('throws on length less than one', () => {
            var row = new Row();
            expect(() => row.readByLength('test', 0)).to.throw('BAD_LENGTH');
        })
        it('throws on length bigger than value length', () => {
            var row = new Row();
            expect(() => row.readByLength('test', 5)).to.throw('TOO_LONG');
        })
        it('reads some values', () => {
            var row = new Row();
            var value = "122333"
            row.readByLength(value, 1);
            row.readByLength(value, 2);
            row.readByLength(value, 3);
            expect(row.rawData.length).to.equal(3);
            expect(row.rawData[0]).to.equal("1");
            expect(row.rawData[1]).to.equal("22");
            expect(row.rawData[2]).to.equal("333");
        })
    })
    describe('by delimiter', () => {
        it('throws on empty value', () => {
            var row = new Row();
            expect(() => row.readByDelimiter(null, ' ')).to.throw('EMPTY');
        })
        it('throws on length less than one', () => {
            var row = new Row();
            expect(() => row.readByDelimiter('test', null)).to.throw('BAD_DELIMITER');
        })
        it('reads all in case of missing delimiter', () => {
            var row = new Row();
            expect(() => row.readByDelimiter('all_the_stuff', ' ')).to.not.throw();
            expect(row.rawData.length).to.equal(1);
            expect(row.rawData[0]).to.equal('all_the_stuff');
        })
        it('reads some values', () => {
            var row = new Row();
            var value = "1 22 333|4444"
            row.readByDelimiter(value, ' ');
            row.readByDelimiter(value, ' ');
            row.readByDelimiter(value, '|');
            row.readByDelimiter(value, ' ');
            expect(row.rawData.length).to.equal(4);
            expect(row.rawData[0]).to.equal("1");
            expect(row.rawData[1]).to.equal("22");
            expect(row.rawData[2]).to.equal("333");
            expect(row.rawData[3]).to.equal("4444");
        })
    })
    describe('to end', () => {
        it('throws on empty value', () => {
            var row = new Row();
            expect(() => row.readByDelimiter(null, ' ')).to.throw('EMPTY');
        })
        it('reads some values', () => {
            var row = new Row();
            var value = "11xxxx"
            row.readByLength(value, 2);
            row.readToEnd(value);
            expect(row.rawData.length).to.equal(2);
            expect(row.rawData[0]).to.equal("11");
            expect(row.rawData[1]).to.equal("xxxx");
        })
    })
})

describe('ABOHeader', () => {
    it('throws error on empty', () => {
        var header = new ABOHeader();
        expect(() => header.parse(null)).to.throw('EMPTY');
    })
    it('throws error on bad length', () => {
        var header = new ABOHeader();
        expect(() => header.parse('123456789')).to.throw('BAD HEADER LENGTH');
    })
    it('parses real values to raw data', () => {
        var header = new ABOHeader();

        var stuff = 'UHL1101017PRIKAZCE NA 20 ZNAKU0222780978658999123456654321'
        expect(() => header.parse(stuff)).to.not.throw();
        expect(header.datum).to.equal('101017');
        expect(header.nazev_prikazce).to.equal('PRIKAZCE NA 20 ZNAKU');
        expect(header.cislo_klienta).to.equal('0222780978');
    })
})

describe('FileHeader', () => {
    it('throws error on empty', () => {
        var header = new FileHeader();
        expect(() => header.parse(null)).to.throw('EMPTY');
    })
    it('parses real values to raw data', () => {
        var header = new FileHeader();

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
        var header = new GroupHeader();
        expect(() => header.parse(null)).to.throw('EMPTY');
    })
    it('parses real values to raw data', () => {
        var header = new GroupHeader();

        var stuff = '2 000000-6206855001 1253400 231218'
        expect(() => header.parse(stuff)).to.not.throw();
        expect(header.prikazce).to.equal('000000-6206855001');
        expect(header.suma).to.equal('1253400');
        expect(header.splatnost).to.equal('231218');
    })
})

describe('Record', () => {
    it('throws error on empty', () => {
        var record = new Record();
        expect(() => record.parse(null)).to.throw('EMPTY');
    })
    it('parses real values to raw data', () => {
        var record = new Record();

        var stuff = '000705-0077627231 1253400 8511271362 07101148'
        expect(() => record.parse(stuff)).to.not.throw();
        expect(record.protistrana).to.equal('000705-0077627231');
        expect(record.castka).to.equal('1253400');
        expect(record.vsym).to.equal('8511271362');
        expect(record.kod_banky).to.equal('0710');
        expect(record.ksym).to.equal('1148');
    })
})