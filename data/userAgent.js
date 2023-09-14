
const userAgents = [
  { name: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:100.0) Gecko/20100101 Firefox/100.0', probability: 0.9 },
  { name: 'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36', probability: 0.7 },
  { name: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36', probability: 0.7 },
  { name: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0', probability: 0.7 },
  { name: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', probability: 0.9 },
];

let result = '';
let rand = Math.random(); // Generate a random number between 0 and 1
console.log(rand);
// Loop through the prizes and check if the random number falls within the probability range
for (const userAgent of userAgents) {
  if (rand < userAgent.probability) {
    result = userAgent.name;
    break;
  }
  rand -= userAgent.probability;
}


module.exports = result;


