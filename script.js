
/*PerfectHash class will 
generate and calculate the primary and secondary hash values*/

const prime = 999999000001; //prime number 
class WordList{
	size         
	words        
}

const base = 256;

class PerfectHash{

	first_a = null;
	first_b = null ;    
	hashTable;       
	secondaryKeys;   


	initialization(){
		this.hashTable = new Array(dictionary.size);
		this.secondaryKeys = new Array(dictionary.size);

		for(var i = 0; i<dictionary.size; i++){
			this.hashTable[i] = [];
			this.secondaryKeys[i] = null;
		}
	}


	stringToNumber(string){
		var stringKey = 0;

		for(var i = 0; i<string.length; i++){

			stringKey = ((stringKey*base)%prime+string.charCodeAt(i))%prime;  

		}

		return stringKey;
	}


	getFirstKey(string){
		var a,b;
		a = 1+ Math.floor(Math.random()*(prime-1));
		b = Math.floor(Math.random()*prime);
		var stringKey = this.stringToNumber(string);


		if(this.first_a == null || this.first_b==null){
			this.first_a = a;
			this.first_b = b;
		}

		else{
			a=this.first_a;
			b=this.first_b;
		}

		var firstKey = (a*stringKey+b)%prime; 

		return firstKey;
	}


	getPrimaryHash(string){
		return this.getFirstKey(string)%dictionary.size;  
	}


	getSecondKey(a, b, m, string){

		var firstKey = this.getFirstKey(string);
		var secondKey = (a*firstKey+b)%prime;  

		return secondKey;
	}


	getSecondaryHash(a, b, m, string){
		return this.getSecondKey(a,b,m,string)%m;  
	                                                
	}


	haveCollied(a, b, m, firstTable, secondTable){
		for(var i=0; i<firstTable.length; i++){
			var secondaryHash = this.getSecondaryHash(a,b,m,dictionary.words[firstTable[i]].en);

			if(secondTable[secondaryHash] == null){
				secondTable[secondaryHash] = firstTable[i];
			}
			else{
				return true
			}
		}

		return false;
	}

	secondaryHashTable(mainTable, primaryHash){

		var m = mainTable.length*mainTable.length; 
		var secondTable = new Array(m); 

		for(var i=0; i<m; i++){
			secondTable[i]=null;
		}

		var firstTable = Array.from(mainTable);  
		var a,b;   
		a = 1+ Math.floor(Math.random()*(prime-1));
		b = Math.floor(Math.random()*prime);

		while(this.haveCollied(a,b,m,firstTable,secondTable)){

			a = 1+ Math.floor(Math.random()*(prime-1));
			b = Math.floor(Math.random()*prime);

			secondTable.fill(null);  
		}


		this.secondaryKeys[primaryHash] = [a,b,m];  
		return secondTable;
	}


	isUnique(string, checkTable){

		for(var i=0; i<checkTable.length; i++){
			if(dictionary.words[checkTable[i]].en == string){
				return false;
			}
		}

		return true;
	}


	generateHashTable(){

		this.initialization();

		for(var i=0; i<dictionary.size; i++){
			dictionary.words[i].en = dictionary.words[i].en.toLowerCase(); 
			var string = dictionary.words[i].en;
			var primaryHash = this.getPrimaryHash(string);

			if(this.isUnique(string,this.hashTable[primaryHash])){

				this.hashTable[primaryHash].push(i);
			} 
		}

		for(var i=0; i<dictionary.size; i++){

			if(this.hashTable[i].length > 1){

				this.hashTable[i] = this.secondaryHashTable(this.hashTable[i],i); 

			}

			else if(this.hashTable[i].length == 1){
				this.secondaryKeys[i] = [1,0,1];
			}
		}

		console.log("HashTable generated");

	}

}


var hash = new PerfectHash();

var dictionary = new WordList();


window.onload = function run(){
	dictionary = fetch("https://raw.githubusercontent.com/mamun2425/Dictionary/main/E2B_DB.json")
	.then(response =>{
		if(!response.ok){
			throw new Error(response.status);
		}

		return response.json()
	})

	.then(json => {
		dictionary.words = json;
		dictionary.size = Object.keys(dictionary.words).length;
	})

	.then(response =>{
		hash.generateHashTable();
	})
}


const searchButton = document.getElementById("search-button");
const searchBox = document.getElementById("search-box");
const input = document.getElementById("input");
const output = document.getElementById("output");

searchButton.addEventListener('click',search);
searchBox.addEventListener('keypress',enter);

function enter(){
	if(event.keyCode == 13){
		search();
		
	}
}


function search(){

	var searchWord = searchBox.value.toLowerCase();
	console.log(searchWord);
	var primaryHash = hash.getPrimaryHash(searchWord);

	try{
		if(hash.secondaryKeys[primaryHash] == null){
			throw 'Word Not Found';
		}

		var a = hash.secondaryKeys[primaryHash][0];
		var b = hash.secondaryKeys[primaryHash][1];
		var m = hash.secondaryKeys[primaryHash][2];

		var secondaryHash = hash.getSecondaryHash(a,b,m,searchWord);

		if(hash.hashTable[primaryHash][secondaryHash]!=null && dictionary.words[hash.hashTable[primaryHash][secondaryHash]].en == searchWord){
			input.innerHTML = searchWord;
			output.innerHTML = dictionary.words[hash.hashTable[primaryHash][secondaryHash]].bn;
		}
		else{
			throw 'Word Not Found';
		}
	}catch(err){
		input.innerHTML = searchWord;
		result.innerHTML = "Sorry, not found.";
	}	
	
}