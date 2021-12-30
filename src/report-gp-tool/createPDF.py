import arcpy
import time
import os, sys

start_time = time.time()
time_pretty = time.strftime("%H:%M:%S", time.localtime())
arcpy.AddMessage('Start time: ' + time_pretty)


def main():
    try:
        where = arcpy.GetParameter(0)  # '"objectIds":"3,4"'
        token = arcpy.GetParameter(1)
        url= f'https://maps.snoqualmietribe.us/server/rest/services/Assert/ASSERT/FeatureServer/1/query?f=json&token=${token}&where=${where}'
        response = requests.get(url).json()
        feature = response['features'][0]

        def match_replace(match):
            try:
                key = match.group('key')
                print(key)
                value = feature[key]
                return value
            except:
                return ''
        
        doc = docx.Document("Snoqualmie_Report_Template1.docx")
        for para in doc.paragraphs:
            for run in para.runs:
                run.text = re.sub ('\${(?P<key>.*)}',
                                match_replace,
                                run.text)

        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    for paragraph in cell.paragraphs:
                        paragraph.text =re.sub ('\${(?P<key>.*)}',
                                match_replace,
                                        paragraph.text)
        doc.save('temp.docx')
        name = str(uuid.uuid4().hex)
        docx2pdf.convert('temp.docx',f'output/{name}.pdf')
            arcpy.AddMessage('survey report: ' + report)
            arcpy.SetParameterAsText(2, name)
        

    except Exception as e:
        # if error at any point, abort!
        arcpy.AddError('{}'.format(e))
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        arcpy.AddError(exc_type.__name__ + ' ' + fname + ' ' + str(exc_tb.tb_lineno))

    time_pretty = time.strftime("%H:%M:%S", time.localtime())
    arcpy.AddMessage('End time: ' + time_pretty)

    elapsed_time = time.time() - start_time
    duration_time = time.strftime("%H:%M:%S", time.gmtime(elapsed_time))
    arcpy.AddMessage('Duration: ' + duration_time)


if __name__ == "__main__":
    main()
