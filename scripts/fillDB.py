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
        with open('elenco_attivita') as json_data:
            elenco_attivita = json.load(json_data)
        
        for anno in elenco_attivita:   
            for attivita in anno['elenco']: 

                #SELECT id_corso
                codice_corso = attivita['valore'][2:attivita['valore'].find('_')-1] #tra "EC" e "_"

                with connection.cursor() as cursor:
                    sql = "SELECT id FROM Corso WHERE codice = %s;" % (codice_corso)
                    cursor.execute(sql)
                    id_corso = cursor.fetchone()[0]
                
                #SELECT id_docente
                with connection.cursor() as cursor:
                    sql = "SELECT id FROM Docente WHERE cognome = '%s';" % (corso['valore'])
                    cursor.execute(sql)
                    id_corso = cursor.fetchone()[0]

                #INSERT materia
                with connection.cursor() as cursor:
                    sql = "INSERT INTO Corso (codice, nome, corso) VALUES ('%s','%s',%d);" % (subcorso['valore'], subcorso['label'], id_corso)
                    cursor.execute(sql)
                connection.commit()
            
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

        for anno in elenco_corsi:   
            for corso in anno['elenco']:    
                for subcorso in corso['elenco_anni']:

                    #get orario da easyroom
                    r = requests.get("https://easyroom.unitn.it/Orario/list_call.php?form-type=corso&anno=%s&corso=%s&anno2=%s&date=%s&_lang=it" % (anno['valore'], corso['valore'], subcorso['valore'], date)) 
                    orario = r.json()

                    for classe in orario:
                        
                        # ------- MATERIA
                        #INSERT materia
                        with connection.cursor() as cursor:
                            sql = "INSERT INTO Corso (nome, id_subcorso) VALUES ('%s');" % (classe['nome_insegnamento'])
                            cursor.execute(sql)
                        connection.commit()

                        # ------- AULA
                        #INSERT aula
                        nome_aula = classe['aula'][:classe['aula'].find('[')-2] #prima di " [Dip"
                        codice_aula = classe['codice_aula'][classe['codice_aula'].find('/')+1:] #dopo '/'
                        dipartimento = classe['codice_aula'][:classe['codice_aula'].find('/')-1] #prima di '/'
                        with connection.cursor() as cursor:
                            sql = "INSERT INTO Aula (codice, nome, dipartimento) VALUES ('%s','%s','%s','%s');" % (aula, codice_aula, dipartimento) #TODO polo e piano
                            cursor.execute(sql)
                        connection.commit()

                        # ------- LEZIONE
                        #SELECT id_docente
                        nome = docente['label'][:docente['label'].find(" ")-1] #dopo ' '
                        cognome = docente['label'][docente['label'].find(" ")+1:] #prima di ' ' 
                        with connection.cursor() as cursor:
                            sql = "SELECT id FROM Docente WHERE cognome = '%s' AND nome='%s';" % (cognome, nome)
                            cursor.execute(sql)
                            id_docente = cursor.fetchone()[0]

                        #SELECT id_materia
                        with connection.cursor() as cursor:
                            sql = "SELECT id FROM Materia WHERE codice = '%s';" % (classe['nome_insegnamento'])
                            cursor.execute(sql)
                            id_materia = cursor.fetchone()[0]
                        
                        #SELECT id_aula
                        with connection.cursor() as cursor:
                            sql = "SELECT id FROM Aula WHERE codice = '%s';" % (codice_aula)
                            cursor.execute(sql)
                            id_aula = cursor.fetchone()[0]

                        #INSERT lezione
                        with connection.cursor() as cursor:
                            sql = "INSERT INTO Lezione (docente, materia, aula, tipologia, inizio, fine, giorno) VALUES (%d, %d, %d, '%s', %s, %s);" % (id_docente, id_materia, id_aula, classe['tipo'], classe['ora_inizio'].replace(":", ""), classe['ora_fine'].replace(":", ""), classe['data'])
                            cursor.execute(sql)
                        connection.commit()
        
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
            