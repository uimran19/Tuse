const {getNext365Dates} = require("../utils")

describe ("getNext365Dates", () => {
    test("returns an array of 365 two-element arrays", () => {
       const result = getNext365Dates()
       expect(result.length).toBe(365) 
       result.forEach((item) => {
        expect(item.length).toBe(2)
       })
    })
    test("index of first and last item are 1 and 365 respectively", () => {
        const result = getNext365Dates()
        expect(result[0][0]).toBe(1)
        expect(result[364][0]).toBe(365)
    })
    test("date format is valid and consistent", () => {
        const result = getNext365Dates()
        result.forEach((item) => {
            expect(item[1]).toMatch(/^\d{4}-\d{1,2}-\d{1,2}$/)
        })
    })
    test("all dates are unique", () => {
        const result = getNext365Dates()
        const dates = result.map(([, date]) => date)
        const uniqueDates = new Set(dates)
        expect(uniqueDates.size).toBe(dates.length)
    })
})