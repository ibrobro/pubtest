const arrayInput = [1,1,2];

/**
 * This is just backup for interview's question #1 answer.
 */
/*
function permute(arr = []) {
	let resultsAsString = [];
  let results = [];

  if(arr.length === 0) return [];
  if(arr.length === 1) return [...arr];

  for (let i = 0; i < arr.length; i++) {
    const currentNum = arr[i];
    const remainingArr = arr.slice(0, i).concat(arr.slice(i + 1));
    const remainingArrPermuted = permute(remainingArr);

    for (let j = 0; j < remainingArrPermuted.length; j++) {
      const permutedArray = [currentNum].concat(remainingArrPermuted[j]);
      const permutedArrayAsString = permutedArray.toString();
      
     	if (resultsAsString.indexOf(permutedArrayAsString) < 0) {
        results.push(permutedArray);
        resultsAsString.push(permutedArrayAsString);
    	}
    }
  },

  return results;
}


const permutedArrayOutput = permute(arrayInput);


for (const item of permutedArrayOutput) {
  console.log(item);
}
*/