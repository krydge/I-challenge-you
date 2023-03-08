class Challenge {
    constructor(_record_name, _measurement, _up_down,_id) {
        this.id = _id
        this.record_name = _record_name;
        this.measurement = _measurement;
        this.up_down = _up_down;
        this.records = []
    }
    addRecords(records) {
        records.map((r) => {
            this.records.push(r)
        })
    }
}
module.exports = Challenge