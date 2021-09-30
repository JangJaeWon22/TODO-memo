const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    value: String,   // 할일 value
    doneAt: Date,   // check한 값
    order: Number  // 갯수
});

//mongoDB의 id값을 가지고 와서 todoId로 저장
TodoSchema.virtual("todoId").get(function (){
    return this._id.toHexString(); //_id 의 string 값 반환
});
//TodoSchemark JSON 형태로 변환이 될때 virtual스키마를 포함한다.
TodoSchema.set("toJSON", {
    virtuals: true,
})

module.exports = mongoose.model("Todo", TodoSchema);