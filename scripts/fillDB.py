#!/usr/bin/python
# -*- coding: utf-8 -*-

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
                #INSERT docente
                with connection.cursor() as cursor:
                    sql = """INSERT INTO Docente (codice, cognomenome) 
                                    SELECT '%s','%s'FROM DUAL 
                                    WHERE NOT EXISTS (SELECT * FROM Docente 
                                        WHERE codice ='%s' AND cognomenome ='%s') 
                                    LIMIT 1""" % (docente['valore'].replace("'","''"), docente['label'].replace("'","''").decode('utf-8').title(), docente['valore'].replace("'","''"), docente['label'].replace("'","''").decode('utf-8').title())
                    cursor.execute(sql)
                connection.commit()

        return 1
    except Exception as inst:
        print inst
        return -1


#returns 1 se finito correttamente, -1 se errore
def fillCorsiSubcorsi ():
    try:

        with open('elenco_corsi') as json_data:
            elenco_corsi = json.load(json_data)

        for anno in elenco_corsi:
            for corso in anno['elenco']:
                #INSERT corso
                with connection.cursor() as cursor:
                    sql = """INSERT INTO Corso (codice, nome) 
                                    SELECT '%s','%s'FROM DUAL 
                                    WHERE NOT EXISTS (SELECT * FROM Corso 
                                        WHERE codice ='%s' AND nome ='%s') 
                                    LIMIT 1""" % (corso['valore'].replace("'","''"), corso['label'].replace("'","''"), corso['valore'].replace("'","''"), corso['label'].replace("'","''"))
                    cursor.execute(sql)
                connection.commit()

                #SELECT id_corso
                with connection.cursor() as cursor:
                    sql = "SELECT id FROM Corso WHERE codice = '%s';" % (corso['valore'].replace("'","''"))
                    cursor.execute(sql)
                    id_corso = cursor.fetchone()[0]
                for subcorso in corso['elenco_anni']:   
                    #INSERT subcorso
                    with connection.cursor() as cursor:       
                        sql = """INSERT INTO Subcorso (codice, nome, corso) 
                                    SELECT '%s','%s',%d FROM DUAL 
                                    WHERE NOT EXISTS (SELECT * FROM Subcorso 
                                        WHERE codice ='%s' AND nome ='%s' AND corso=%d) 
                                    LIMIT 1""" % (subcorso['valore'].replace("'","''"), subcorso['label'].replace("'","''").decode('utf-8').lower(), id_corso, subcorso['valore'].replace("'","''"), subcorso['label'].replace("'","''").decode('utf-8').lower(), id_corso)
                        cursor.execute(sql)
                    connection.commit()

        return 1
    except Exception as inst:
        print inst
        return -1
    

#returns 1 se finito correttamente, -1 se errore
def fillDipartimenti ():
    try:
        
        with open('elenco_sedi') as json_data:
            elenco_sedi = json.load(json_data)
        
        for dipartimento in elenco_sedi:
            #INSERT dipartimento
            with connection.cursor() as cursor:
                sql = """INSERT INTO Dipartimento (codice, nome) 
                                    SELECT '%s','%s' FROM DUAL 
                                    WHERE NOT EXISTS (SELECT * FROM Dipartimento 
                                        WHERE codice ='%s' AND nome ='%s') 
                                    LIMIT 1""" % (dipartimento['valore'].replace("'","''"), dipartimento['label'].replace("'","''"), dipartimento['valore'].replace("'","''"), dipartimento['label'].replace("'","''"))
                cursor.execute(sql)
            connection.commit()
        
        return 1
    except Exception as inst:
        print inst
        return -1


#returns 1 se finito correttamente, -1 se errore
def fillMaterieAuleLezioni ():
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
                    for i in xrange(orario['contains_data']):
                        # ------- MATERIA
                        #INSERT materia
                        with connection.cursor() as cursor:
                            sql = """INSERT INTO Materia (nome) 
                                SELECT '%s' FROM DUAL
                                WHERE NOT EXISTS (SELECT * FROM Materia 
                                    WHERE nome ='%s') 
                                LIMIT 1""" % (orario[str(i)]['nome_insegnamento'].replace("'","''"), orario[str(i)]['nome_insegnamento'].replace("'","''"))
                            cursor.execute(sql)
                        connection.commit()

                        # ------- MATERIASUBCORSI
                        #SELECT id_subcorso
                        with connection.cursor() as cursor:
                            sql = "SELECT id FROM Subcorso WHERE codice = '%s';" % (subcorso['valore'].replace("'","''"))
                            cursor.execute(sql)
                            res = cursor.fetchone()
                            if res is not None:
                                id_subcorso = res[0]
                            else: 
                                continue
                        #SELECT id_materia
                        with connection.cursor() as cursor:
                            sql = "SELECT id FROM Materia WHERE nome = '%s';" % (orario[str(i)]['nome_insegnamento'].replace("'","''"))
                            cursor.execute(sql)
                            res = cursor.fetchone()
                            if res is not None:
                                id_materia = res[0]
                            else: 
                                continue
                        #INSERT materiaSubcorso
                        with connection.cursor() as cursor:
                            sql = "INSERT IGNORE INTO MateriaSubcorso (materia, subcorso) VALUES ('%s','%s');" % (id_materia,id_subcorso)
                            cursor.execute(sql)
                        connection.commit()

                        # ------- LEZIONE
                        #SELECT id_docente
                        if orario[str(i)]['docente'].find(',') != -1:
                            cognomenome = orario[str(i)]['docente'][: orario[str(i)]['docente'].find(',')] #prima di ',' se sono piu docenti
                        else:
                            cognomenome = orario[str(i)]['docente']
                        with connection.cursor() as cursor:
                            sql = "SELECT id FROM Docente WHERE cognomenome = '%s';" % (cognomenome.replace("'","''"))
                            cursor.execute(sql)
                            res = cursor.fetchone()
                            if res is not None:
                                id_docente = res[0]
                            else: 
                                continue
                        #SELECT id_materia
                        #with connection.cursor() as cursor:
                        #    sql = "SELECT id FROM Materia WHERE codice = '%s';" % (orario[str(i)]['nome_insegnamento'])
                        #    cursor.execute(sql)
                        #    id_materia = cursor.fetchone()[0]
                        #INSERT lezione
                        data = datetime.datetime.strptime(orario[str(i)]['data'], '%d-%m-%Y')
                        ora_inizio = orario[str(i)]['ora_inizio'] + ":00"
                        ora_fine = orario[str(i)]['ora_fine'] + ":00"
                        with connection.cursor() as cursor:
                            sql = """INSERT INTO Lezione (docente, materia, tipologia, inizio, fine, giorno)
                                SELECT %d, %d, '%s', '%s', '%s', '%s' FROM DUAL 
                                WHERE NOT EXISTS (SELECT * FROM Lezione 
                                    WHERE docente =%d AND materia =%d AND tipologia ='%s' AND inizio ='%s' AND fine ='%s' AND giorno ='%s') 
                                LIMIT 1""" % (id_docente, id_materia, orario[str(i)]['tipo'], ora_inizio, ora_fine, data.strftime('%Y-%m-%d'), id_docente, id_materia, orario[str(i)]['tipo'], ora_inizio, ora_fine, data.strftime('%Y-%m-%d'))
                            cursor.execute(sql)
                        connection.commit()

                        # ------- AULE
                        #SELECT id_dipartimento
                        dipartimento = orario[str(i)]['aula'][orario[str(i)]['aula'].find('[')+1 : orario[str(i)]['aula'].find(']')].replace("'","''")
                        with connection.cursor() as cursor:
                            sql = "SELECT id FROM Dipartimento WHERE nome = '%s';" % (dipartimento)
                            cursor.execute(sql)
                            res = cursor.fetchone()
                            if res is not None:
                                id_dipartimento = res[0]
                            else:
                                dipartimento = orario[str(i)]['codice_aula'][:orario[str(i)]['codice_aula'].find('/')]
                                sql = "SELECT id FROM Dipartimento WHERE nome = '%s';" % (dipartimento)
                                cursor.execute(sql)
                                res = cursor.fetchone()
                                if res is not None:
                                    id_dipartimento = res[0]
                                else:
                                    print dipartimento + " non trovato " + orario[str(i)]['codice_aula'] + " " + orario[str(i)]['nome_insegnamento']
                                    continue
                        #INSERT aule
                        nome_aula = orario[str(i)]['aula'][:orario[str(i)]['aula'].find('[')-1].replace("(","").replace(")","") #prima di " [Dip"
                        codici_aule = orario[str(i)]['codice_aula'].split(", ")
                        for aula in codici_aule:
                            #INSERT aula
                            codice_aula = aula[aula.find('/')+1:].replace("(","").replace(")","") #dopo '/'
                            with connection.cursor() as cursor:
                                sql = """INSERT INTO Aula (nome, codice, dipartimento) 
                                    SELECT '%s','%s',%d FROM DUAL 
                                    WHERE NOT EXISTS (SELECT * FROM Aula 
                                        WHERE codice ='%s' AND dipartimento =%d) 
                                    LIMIT 1""" % (nome_aula, codice_aula, id_dipartimento, codice_aula, id_dipartimento)
                                #TODO polo e piano             
                                cursor.execute(sql)
                            connection.commit()

                            # ------- AULALEZIONE
                            #SELECT id_lezione
                            with connection.cursor() as cursor:
                                sql = """SELECT id FROM Lezione 
                                    WHERE docente =%d AND materia =%d AND tipologia ='%s' AND inizio ='%s' AND fine ='%s' AND giorno ='%s';
                                    """ % (id_docente, id_materia, orario[str(i)]['tipo'], ora_inizio, ora_fine, data.strftime('%Y-%m-%d'))
                                cursor.execute(sql)
                                res = cursor.fetchone()
                                if res is not None:
                                    id_lezione = res[0]
                                else: 
                                    continue
                            #SELECT id_aula
                            with connection.cursor() as cursor:
                                sql = "SELECT id FROM Aula WHERE codice = '%s' AND dipartimento = '%s';" % (codice_aula, id_dipartimento)
                                cursor.execute(sql)
                                res = cursor.fetchone()
                                if res is not None:
                                    id_aula = res[0]
                                else: 
                                    continue
                            #INSERT aulalezione
                            with connection.cursor() as cursor:
                                sql = "INSERT IGNORE INTO AulaLezione (aula, lezione) VALUES ('%s','%s');" % (id_aula,id_lezione)
                                cursor.execute(sql)
                            connection.commit()
        
        return 1
    except Exception as inst:
        print inst
        return -1


#Connect to the database
connection = pymysql.connect(host='localhost',user='root', password='', db='aulando')

if fillDipartimenti() == -1:
    print "errore fillDipartimenti"
print "done fillDipartimenti"

if fillDocenti() == -1:
    print "errore fillDocenti"
print "done fillDocenti"

if fillCorsiSubcorsi() == -1:
    print "errore fillCorsiSubcorsi" # TODO separare anno da codice subcorso
print "done fillCorsiSubcorsi"

if fillMaterieAuleLezioni() == -1:
    print "errore fillMaterieAuleLezioni"
print "done fillMaterieAuleLezioni"


connection.close()
