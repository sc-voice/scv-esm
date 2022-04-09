import Hi from "../src/hi.js";
import pkg from "../main.js";
//import pkg from "../index.js";
//const { Hi } = pkg;
console.log('pkg', pkg);

import should from "should";

(typeof describe === 'function') && describe("sutta-ref", function() {
  it("test", ()=>{
    let msg = Hi.sayHi("world");
    should(msg).equal("Hi, world!");
  });
});
