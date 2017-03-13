/**
 * Created by okredo on 3/11/17.
 * Write simple asynchronous code with JavaScript generators
 * Egghead.io course notes
 */

/*
 * 1) Use JavaScript (ES6) generators to pause function execution
 */
console.log('\n1) Use JavaScript (ES6) generators to pause function execution\n')
function* createLogger() {
  console.log('start')
  yield
  console.log('Second block')
  yield
  console.log('Third block')
  yield
  console.log('end')
}

const logger = createLogger()
logger.next()
logger.next()


/*
 * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 */
console.log('\nFrom https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators\n')
function* fibonacci() {
  var fn1 = 0;
  var fn2 = 1;
  while (true) {
	var current = fn1;
	fn1 = fn2;
	fn2 = current + fn1;
	var reset = yield current;
	if (reset) {
	  fn1 = 0;
	  fn2 = 1;
	}
  }
}

var sequence = fibonacci();
console.log(sequence.next().value);     // 0
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 2
console.log(sequence.next().value);     // 3
console.log(sequence.next().value);     // 5
console.log(sequence.next().value);     // 8
console.log(sequence.next(true).value); // 0
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 2

/*
* 2)  Send messages to and from JavaScript (ES6) generators
*/
console.log('\n2)  Send messages to and from JavaScript (ES6) generators\n')
function* createHello() {
  yield 'first'
}

const hello = createHello()
console.log(hello.next())
console.log(hello.next())

function* createHelloWord() {
  const word = yield
  console.log(`Hello ${word}`)
}

const helloWord = createHelloWord()
console.log(helloWord.next())
console.log(helloWord.next('King Kenny'))

/*
 * 3) Error handling in JavaScript (ES6) generators
 */
console.log('\n3) Error handling in JavaScript (ES6) generators\n')
function* createHelloEx() {
  try {
    const word = yield
    console.log(`Hello ${word}`)
  }
  catch(err) {
    console.log('ERROR', err)
  }
}

const helloEx = createHelloEx()
helloEx.next()
console.log(helloEx.next('King Kenny'))
//helloEx.throw('Something went wrong')

/*
4)  Iterate over JavaScript (ES6) generators
 */
console.log('\n4)  Iterate over JavaScript (ES6) generators\n')
function* createCounter() {
  yield 1
  yield 2
  yield 3
  yield 4
}

const counter = createCounter()
for (let i of counter) {
  console.log(i)
}

/*
 5) Delegate JavaScript (ES6) generator iteration control
 */
console.log('\n5) Delegate JavaScript (ES6) generator iteration control\n')

function* create3to4Counter() {
  yield 3
  //yield 4
  return 4
}
function* createCounter5() {
  yield 1
  yield 2
  //yield* create3to4Counter()
  const four = yield* create3to4Counter()
  console.log(four)
  yield 5
}

for (let i of createCounter5()) {
  console.log(i)
}

/*
6) Use JavaScript (ES6) generators with Promises to handle async flows
 */
console.log('\n6) Use JavaScript (ES6) generators with Promises to handle async flows\n')
const url = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'
const fetch = require('node-fetch')
const co = require('co');
console.log (url)

fetch(url)
.then(function(res) {
  return res.text();
}).then(function(body) {
  console.log(body);
});

function* createQuoteFetcher(){
  const response = yield fetch(url)
  const quote = yield response.json()
  return `${quote.quoteText} - ${quote.quoteAuthor}`
}

// const quoteFetcher = createQuoteFetcher()
// quoteFetcher.next().value
// 	.then(res => quoteFetcher.next(res).value)
// 	.then(res => quoteFetcher.next(res).value)
// 	.then(quote => console.log(quote))
// 	.catch(err => console.log(err))

const quoteFetcher = co(createQuoteFetcher())
quoteFetcher.then(quote => console.log(quote))

//
// Notes from this example from https://www.npmjs.com/package/node-fetch docs page:
//
// catching network error
// 3xx-5xx responses are NOT network errors, and should be handled in then()
// you only need one catch() at the end of your promise chain

// fetch('http://domain.invalid/')
// .catch(function(err) {
//   console.log(err);
// });

// node 0.12+, yield with co
//
// var co = require('co');
// co(function *() {
//   var res = yield fetch('https://api.github.com/users/github');
//   var json = yield res.json();
//   console.log(res);
// });
