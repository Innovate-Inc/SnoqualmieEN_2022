from arcgis.apps.survey123._survey import SurveyManager, Survey
from arcgis.gis import GIS
import arcpy
import time
import os, sys

start_time = time.time()
time_pretty = time.strftime("%H:%M:%S", time.localtime())
arcpy.AddMessage('Start time: ' + time_pretty)


def main():
    try:
        survey = arcpy.GetParameter(0)  # '0d87ba0b72cf4c32b35c1db4d58c370d'
        token = arcpy.GetParameter(1)
        # token = "vuyLIVxjby30cXudDVLYxq1g0Ar17hvO5L5mP7mEjgPEngqC8wdUXkY3sVrjpnWJLFJhLgX8aHUx0g9pfli372xo9iBfGl5tQqOY77kNUpp8JTBXgwbQYv64uedXbP_n0OC9a6qAU_5jeyNgmPDMXIo2fThRxvb5CK9az3op1IFHIhIOygLg0mpmcQmvnBdk6paNq2mOtOX8DrsWJ9Yy6SoOx16KzHdjA6Px7GQEkxpxxQurvAKD-5NZf7eMaBqm"
        print(token)
        template = int(arcpy.GetParameter(2))  # 3
        where = arcpy.GetParameter(3)  # '"objectIds":"3,4"'
        utc_offset = arcpy.GetParameter(4)  # '-07:00'
        title = arcpy.GetParameter(5)  # 'Kamilo_Report'
        portal_url = arcpy.GetParameter(6)
        cliend_id = arcpy.GetParameter(7)
        # gis = GIS(None, token='ZV37FOVq4X3Lxamjl9ORCrLj6rK5T2kcwh0WghB6AthYLZKqEpfhT0dTbwxioCsRYpY6oWCMq9bJktCzyn2aSaFMGXSQNgWWB_-Bm3ZleLfhYbfavk4DBMZeZt6-Rl-5FMnAgc5wpJlvpNfVEiwj2w..')
        gis = GIS(portal_url, token=token)
        sm = SurveyManager(gis)
        survey = sm.get(survey)
        template_id = survey.report_templates[template].id
        arcpy.AddMessage(survey.report_templates)
        report = survey.generate_report(survey.report_templates[template], where, utc_offset, title)
        # report_id_arr = []
        # for report in survey.reports:
        #     print(report)
        #     arcpy.AddMessage('doc id: ' + report.id)
        #     if report.id != template_id:
        #         report_id_arr.append(report.id)
        # report_ids = '["' + '", "'.join(report_id_arr) + '"]'
        arcpy.AddMessage('doc id: ' + report.id)
        arcpy.SetParameterAsText(8, report.id)

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
