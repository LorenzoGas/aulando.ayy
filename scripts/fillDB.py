#!/usr/bin/python

import json
import requests
import pymysql.cursors

#parsing dei jsons
with open('elenco_attivita') as json_data:
    elenco_attivita = json.load(json_data)
with open('elenco_corsi') as json_data:
    elenco_corsi = json.load(json_data)
with open('elenco_docenti') as json_data:
    elenco_docenti = json.load(json_data)
with open('elenco_sedi') as json_data:
    elenco_sedi = json.load(json_data)

date = "12-10-2017"

#itera gli anni
for anno in elenco_corsi:   
    print anno['valore']

    #itera i corsi
    for corso in anno['elenco']:    
        print "\t-> " + corso['valore']

        #itera gli anni dei corsi o varianti
        for subcorso in corso['elenco_anni']:   
            print "\t\t-> " + subcorso['valore'] + "\n"

            #get orario da easyroom
            r = requests.get("https://easyroom.unitn.it/Orario/list_call.php?form-type=corso&anno=%s&corso=%s&anno2=%s&date=%s&_lang=it" % (anno['valore'], corso['valore'], subcorso['valore'], date)) 
            orario = r.json()
            print "https://easyroom.unitn.it/Orario/list_call.php?form-type=corso&anno=%s&corso=%s&anno2=%s&date=%s&_lang=it" % (anno['valore'], corso['valore'], subcorso['valore'], date)
            #print orario
            #print "\n\n"

            
            

