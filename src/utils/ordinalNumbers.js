function OrdinalNumbers(lang) {
    this.lang = lang
    
    const cat_suffix =  {
      1: "r",
      2: "n",
      3: "r",
      4: "t",
      other: "è"
    };

    this.formatOrdinals = (n) => {

        if(this.lang === 'ca'){
            let key = n>=5 ? 'other' : n
            const suffix = cat_suffix[key];
            return `${n}${suffix}`;
        }
        else {
            return `${n}${"º"}`;
        }
      };
};


export default OrdinalNumbers