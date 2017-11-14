#!/usr/bin/python

import sys
import json
import requests
import pymysql.cursors
import datetime

reload(sys)
sys.setdefaultencoding('utf-8')



#returns 1 se finito correttamente, -1 se errore
def fillDocenti ():
    try:

        with open('elenco_docenti') as json_data:
            elenco_docenti = json.load(json_data)

        for anno in elenco_docenti:
            for docente in anno['elenco']:

                separator = docente['label'].find(" ")
                cognome = docente['label'][:separator]
                nome = docente['label'][separator+1:]
                #INSERT docente
                with connection.cursor() as cursor:
                    sql = "INSERT IGNORE INTO Docente (codice, nome, cognome) VALUES ('%s','%s','%s');" % (docente['valore'].replace("'","''"), nome.replace("'","''").decode('utf-8').lower(), cognome.replace("'","''").decode('utf-8').lower())
                    cursor.execute(sql)
                connection.commit()

        return 1
    except:
        return -1


#returns 1 se finito correttamente, -1 se errore
def fillCorsi ():
    try:

        with open('elenco_corsi') as json_data:
            elenco_corsi = json.load(json_data)

        for anno in elenco_corsi:
            for corso in anno['elenco']:
                #INSERT corso
                with connection.cursor() as cursor:
                    sql = "INSERT IGNORE INTO Corso (codice, nome) VALUES ('%s','%s');" % (corso['valore'].replace("'","''"), corso['label'].replace("'","''"))
                    cursor.execute(sql)
                connection.commit()

        return 1
    except:
        return -1


#returns 1 se finito correttamente, -1 se errore
def fillSubcorsi ():
    try:

        with open('elenco_corsi') as json_data:
            elenco_corsi = json.load(json_data)

        for anno in elenco_corsi:   
            for corso in anno['elenco']:    

                #SELECT id_corso
                with connection.cursor() as cursor:
                    sql = "SELECT id FROM Corso WHERE codice = '%s';" % (corso['valore'].replace("'","''"))
                    cursor.execute(sql)
                    id_corso = cursor.fetchone()[0]
                for subcorso in corso['elenco_anni']:   
                    #INSERT subcorso
                    with connection.cursor() as cursor:
                        sql = "INSERT IGNORE INTO Subcorso (codice, nome, corso) VALUES ('%s','%s',%d);" % (subcorso['valore'].replace("'","''"), subcorso['label'].replace("'","''").decode('utf-8').lower(), id_corso)
                        cursor.execute(sql)
                    connection.commit()

        return 1
    except:
        return -1


#returns 1 se finito correttamente, -1 se errore
def fillMaterie ():
    try:
        
        #TODO
            
        return 1
    except:
        return -1
    

def fillDipartimenti ():
    try:
        
        with open('elenco_sedi') as json_data:
            elenco_sedi = json.load(json_data)
        
        for dipartimento in elenco_sedi:
            #INSERT dipartimento
            with connection.cursor() as cursor:
                sql = "INSERT IGNORE INTO Dipartimento (codice, nome) VALUES ('%s','%s');" % (dipartimento['valore'].replace("'","''"), dipartimento['label'].replace("'","''"))
                cursor.execute(sql)
            connection.commit()
        
        return 1
    except:
        return -1


def fillPoli ():
    try:

        #TODO
        
        return 1
    except:
        return -1


def fillAule ():
    try:

        #TODO
        
        return 1
    except:
        return -1


def fillLezioni ():
    try:
        with open('elenco_corsi') as json_data:
            elenco_corsi = json.load(json_data)

        oggi = datetime.date.today().strftime('%d-%m-%Y')

        for anno in elenco_corsi:   
            for corso in anno['elenco']:    
                for subcorso in corso['elenco_anni']:

                    #get orario da easyroom
                    r = requests.get("https://easyroom.unitn.it/Orario/list_call.php?form-type=corso&anno=%s&corso=%s&anno2=%s&date=%s&_lang=it" % (anno['valore'], corso['valore'], subcorso['valore'], oggi)) 
                    orario = r.json()

                    print "\nhttps://easyroom.unitn.it/Orario/list_call.php?form-type=corso&anno=%s&corso=%s&anno2=%s&date=%s&_lang=it" % (anno['valore'], corso['valore'], subcorso['valore'], oggi)
                    
                    i = 0
                    while orario['contains_data'] > 0: 
                        try:
                            i += 1
                            # ------- MATERIA
                            #INSERT materia
                            with connection.cursor() as cursor:
                                sql = "INSERT IGNORE INTO Materia (nome) VALUES ('%s');" % (orario[str(i)]['nome_insegnamento'].replace("'","''"))
                                print sql
                                cursor.execute(sql)
                            connection.commit()

                            # ------- MATERIASUBCORSI
                            #SELECT id_subcorso
                            with connection.cursor() as cursor:
                                sql = "SELECT id FROM Subcorso WHERE codice = '%s';" % (subcorso['valore'])
                                cursor.execute(sql)
                                id_subcorso = cursor.fetchone()[0]
                            #SELECT id_materia
                            with connection.cursor() as cursor:
                                sql = "SELECT id FROM Materia WHERE nome = '%s';" % (orario[str(i)]['nome_insegnamento'].replace("'","''"))
                                cursor.execute(sql)
                                id_materia = cursor.fetchone()[0]
                            #INSERT materiaSubcorso
                            with connection.cursor() as cursor:
                                sql = "INSERT IGNORE INTO MateriaSubcorso (materia, subcorso) VALUES ('%s','%s');" % (id_materia,id_subcorso)
                                print sql
                                cursor.execute(sql)
                            connection.commit()

                            # ------- AULA
                            #SELECT id_dipartimento
                            dipartimento = orario[str(i)]['codice_aula'][:orario[str(i)]['codice_aula'].find('/')] #prima di '/'
                            with connection.cursor() as cursor:
                                sql = "SELECT id FROM Dipartimento WHERE codice = '%s';" % (dipartimento)
                                cursor.execute(sql)
                                id_dipartimento = cursor.fetchone()[0]
                            #INSERT aula
                            nome_aula = orario[str(i)]['aula'][:orario[str(i)]['aula'].find('[')-1] #prima di " [Dip"
                            codice_aula = orario[str(i)]['codice_aula'][orario[str(i)]['codice_aula'].find('/')+1:] #dopo '/'
                            with connection.cursor() as cursor:
                                sql = "INSERT IGNORE INTO Aula (nome, codice, dipartimento) VALUES ('%s','%s','%s');" % (nome_aula, codice_aula, id_dipartimento) #TODO polo e piano
                                print sql                            
                                cursor.execute(sql)
                            connection.commit()

                            # ------- LEZIONE
                            #SELECT id_docente
                            cognome = orario[str(i)]['docente'][:orario[str(i)]['docente'].find(" ")] #prima di ' '
                            if orario[str(i)]['docente'].find(',') != -1:
                                nome = orario[str(i)]['docente'][orario[str(i)]['docente'].find(" ")+1 : orario[str(i)]['docente'].find(',')] #dopo ' ' e prima di ',' se sono piu docenti
                            else:
                                nome = orario[str(i)]['docente'][orario[str(i)]['docente'].find(" ")+1 :] #dopo ' '
                            with connection.cursor() as cursor:
                                sql = "SELECT id FROM Docente WHERE cognome = '%s' AND nome='%s';" % (cognome.replace("'","''"), nome.replace("'","''"))
                                cursor.execute(sql)
                                id_docente = cursor.fetchone()[0]
                            #SELECT id_materia
                            #with connection.cursor() as cursor:
                            #    sql = "SELECT id FROM Materia WHERE codice = '%s';" % (orario[str(i)]['nome_insegnamento'])
                            #    cursor.execute(sql)
                            #    id_materia = cursor.fetchone()[0]
                            #SELECT id_aula
                            with connection.cursor() as cursor:
                                sql = "SELECT id FROM Aula WHERE codice = '%s' AND dipartimento = %d;"% (codice_aula, id_dipartimento)
                                cursor.execute(sql)
                                id_aula = cursor.fetchone()[0]
                            #INSERT lezione
                            data = datetime.datetime.strptime(orario[str(i)]['data'], '%d-%m-%Y')
                            with connection.cursor() as cursor:
                                sql = "INSERT INTO Lezione (docente, materia, aula, tipologia, inizio, fine, giorno) VALUES (%d, %d, %d, '%s', %s, %s, %s);" % (id_docente, id_materia, id_aula, orario[str(i)]['tipo'], orario[str(i)]['ora_inizio'].replace(":", ""), orario[str(i)]['ora_fine'].replace(":", ""), data.strftime('%Y-%m-%d'))
                                print sql
                                cursor.execute(sql)
                            connection.commit()
                            
                        except:
                            break
        
        return 1
    except:
        return -1


def fillMateriaCorsi ():
    try:

        #TODO
        
        return 1
    except:
        return -1


#Connect to the database
connection = pymysql.connect(host='localhost',user='root', password='', db='aulando')

if fillDipartimenti() == -1:
    print "errore fillDipartimenti"
print "done fillDipartimenti"

if fillDocenti() == -1: # TODO maiuscoleiniziali
    print "errore fillDocenti"
print "done fillDocenti"

if fillCorsi() == -1:
    print "errore fillCorsi"
print "done fillCorsi"

if fillSubcorsi() == -1:
    print "errore fillSubcorsi" # TODO separare anno da codice
print "done fillSubcorsi"

if fillLezioni() == -1:
    print "errore fillLezioni"
print "done fillLezioni"

connection.close()
