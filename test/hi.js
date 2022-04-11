import { Hi } from "../main.js";
import should from "should";

(typeof describe === 'function') && describe("sutta-ref", function() {
  it("test", ()=>{
    let msg = Hi.sayHi("world");
    should(msg).equal("Hi, world!");
  });
});
