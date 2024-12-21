addLayer("info", {
    tabFormat: [
        ["blank", "100px"],
        ["infobox", [11]]
    ],

    infoboxes: {
        11: {
            title: "Replicanti",
            body() { return `<b>Replicanti</b> are your main resource throughout the entire game.<br>
                            They produce exponentially, in the sense that the more you 
                            have, the more you will get.<br><br>
                            
                            Each second, your Replicanti grows by<br>
                            r+r*chance*(1000/interval).<br><br>
                            
                            By default, the Replicanti Interval scales by ×log10(r),<br>
                            where r is your Replicanti. This means that, for each<br>
                            order of magnitude (OoM) of Replicanti, your interval will,<br>
                            additively, be 100% slower.<br><br>
                            
                            Beyond 1.8e308 Replicanti, in addition to the previous<br>
                            formula, your Replicanti Interval will be multiplied by<br>
                            ×100, and then by 2^(log10(replicanti)/100).<br>
                            This means that, for each 100 OoM's of Replicanti,<br>
                            your interval will be multiplied by 2.<br><br>
                            
                            Beyond 1e100,000 Replicanti, the previous formula will<br>
                            be modified such that the base (2, in this case) will<br>
                            increase as your Replicanti increase, at a rate of<br>
                            2+((log10(replicanti)-100000)/1000)<br>
                            This means that, for each 1000 OoM's of Replicanti beyond<br>
                            1e100,000, the base for the post-1.8e308 formula will<br>
                            increase by one.<br><br>

                            As an example, let's say you have 1e102,000 Replicanti.<br>
                            This means you have 2000 OoM's beyond 1e100,000, which<br>
                            will increase the base by 2. As such, the post-1.8e308<br>
                            formula will become 4^(log10(replicanti)/100).<br><br>
                            
                            Remember that a higher Interval means slower Replicanti<br>
                            generation.` }
        }
    },
})