#!/usr/bin/python

import json
import requests
import pymysql.cursors
import datetime


#returns 1 se finito correttamente, -1 se errore
def fillDocenti ():
    try:

        with open('elenco_docenti') as json_data:
            elenco_docenti = json.load(json_data)

        for anno in elenco_docenti:
            for docente in anno['elenco']:

                separator = docente['label'].find(" ")
                cognome = docente['label'][:separator-1]
                nome = docente['label'][separator+1:]

                #INSERT docente
                with connection.cursor() as cursor:
                    sql = "INSERT INTO Docente (codice, nome, cognome) VALUES ('%s','%s','%s');" % (docente['valore'], nome, cognome)
                    cursor.execute(sql)
                connection.commit()

        return 1
    except:
        return -1
    finally:
        connection.close()


#returns 1 se finito correttamente, -1 se errore
def fillCorsi ():
    try:

        with open('elenco_corsi') as json_data:
            elenco_corsi = json.load(json_data)

        for anno in elenco_corsi:
            for corso in anno['elenco']:

                #INSERT corso
                with connection.cursor() as cursor:
                    sql = "INSERT INTO Corso (codice, nome) VALUES ('%s','%s');" % (corso['valore'], corso['label'])
                    cursor.execute(sql)
                connection.commit()

        return 1
    except:
        return -1
    finally:
        connection.close()


#returns 1 se finito correttamente, -1 se errore
def fillSubcorsi ():
    try:

        with open('elenco_corsi') as json_data:
            elenco_corsi = json.load(json_data)

        for anno in elenco_corsi:   
            for corso in anno['elenco']:    

                #SELECT id_corso
                with connection.cursor() as cursor:
                    sql = "SELECT id FROM Corso WHERE codice = '%s';" % (corso['valore'])
                    cursor.execute(sql)
                    id_corso = cursor.fetchone()[0]

                for subcorso in corso['elenco_anni']:   

                    #INSERT subcorso
                    with connection.cursor() as cursor:
                        sql = "INSERT INTO Corso (codice, nome, corso) VALUES ('%s','%s',%d);" % (subcorso['valore'], subcorso['label'], id_corso)
                        cursor.execute(sql)
                    connection.commit()

        return 1
    except:
        return -1
    finally:
        connection.close()


#returns 1 se finito correttamente, -1 se errore
def fillMaterie ():
    try:

        #TODO
        
        return 1
    except:
        return -1
    finally:
        connection.close()
    

def fillDipartimenti ():
    try:
        
        with open('elenco_sedi') as json_data:
            elenco_sedi = json.load(json_data)
        
        for dipartimento in elenco_sedi:
            #INSERT dipartimento
            with connection.cursor() as cursor:
                sql = "INSERT INTO Dipartimento (codice, nome) VALUES ('%s','%s');" % (dipartimento['valore'], dipartimento['label'])
                cursor.execute(sql)
            connection.commit()
        
        return 1
    except:
        return -1
    finally:
        connection.close()


def fillPoli ():
    try:

        #TODO
        
        return 1
    except:
        return -1
    finally:
        connection.close()


def fillAule ():
    try:

        #TODO
        
        return 1
    except:
        return -1
    finally:
        connection.close()


def fillLezioni ():
    try:

        #TODO
        
        return 1
    except:
        return -1
    finally:
        connection.close()


def fillMateriaCorsi ():
    try:

        #TODO
        
        return 1
    except:
        return -1
    finally:
        connection.close()


#Connect to the database
connection = pymysql.connect(host='localhost',user='root', password='', db='aulando')

try:
    #INSERT carta
    with connection.cursor() as cursor:
        sql = "INSERT INTO Carte (numero_carta, scadenza_carta, intestatario_carta, CCV_carta, id_utente) VALUES ("+str(numero)+", '"+str(scadenza)+"', '"+str(intestatario)+"', '"+str(ccv)+"', '"+str(id_user)+"');"
        cursor.execute(sql)
    connection.commit()

    #SELECT
    with connection.cursor() as cursor:
        sql = "SELECT COUNT(*) FROM Carte WHERE numero_carta = "+ str(numero) +";"
        cursor.execute(sql)
        exists = cursor.fetchone()[0]
finally:
    connection.close()





###################################


#parsing dei jsons
with open('elenco_attivita') as json_data:
    elenco_attivita = json.load(json_data)
with open('elenco_corsi') as json_data:
    elenco_corsi = json.load(json_data)
with open('elenco_docenti') as json_data:
    elenco_docenti = json.load(json_data)
with open('elenco_sedi') as json_data:
    elenco_sedi = json.load(json_data)

date = "12-10-2017" #TODO orario restituisce una settimana, dare la data della settiana correntte

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

            for classe in orario:
                classe['nome_insegnamento']
                classe['ora_inizio']
                classe['ora_fine']
                classe['docente']
                classe['numero_giorno'] #1 a 6 lun a sabato
                classe['aula'] # esempio "Aula A101 [Dipartimenti - POVO]"
                classe['codice_aula'] #	esempio "E0503/A101"
            