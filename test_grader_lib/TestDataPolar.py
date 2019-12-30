import copy
import unittest
import json
from GradeableCollection import GradeableCollection
from csv_to_data_new import load_csv_data

class TestDataPolar(unittest.TestCase):
    # extracted ## examples of correct/incorrect data from the following csv files
    # MITx_18.01.3x_1T2016_student_state_from_i4x___MITx_18.01.3x_problem_polar-tab5-problem2_2016-07-25-1734.anon.csv
    # MITx_18.01.3x_1T2016_student_state_from_i4x___MITx_18.01.3x_problem_polar-tab7-problem1_2016-07-28-0135.anon.csv
    # MITx_18.01.3x_1T2016_student_state_from_i4x___MITx_18.01.3x_problem_polar-tab14-problem1_2016-07-28-0223.anon.csv
    # MITx_18.01.3x_1T2016_student_state_from_i4x___MITx_18.01.3x_problem_polar-tab14-problem3_2016-07-28-1553.anon.csv
    # MITx_18.01.3x_1T2016_student_state_from_i4x___MITx_18.01.3x_problem_polar-tab16-problem1_2016-07-28-1616.anon.csv
    
    def loadData(self, filename):
        # load the data from the given csv file and return the first result
        # with a correct answer
        csv_dir = './'
        data = load_csv_data(csv_dir + filename, [], [])
        answers = []
        for d in data:
            answer = json.loads(d['gradeable'])
            answers.append(self.load_as_gradeable_collections(answer))

        return answers


    def load_as_gradeable_collections(self, source):
        #answers = self.get_data(source)
        source['meta']['config']['coordinates'] = 'polar'
        answers = [source]
        #answers = self.data[source]
        list_of_gradeables = []
        for answer in answers:
            gradeables = {identifier: GradeableCollection(
                identifier, answer['meta']['config'], gradeable_list)
                for identifier, gradeable_list in answer['data'].items()}
            list_of_gradeables.append(gradeables)

        return list_of_gradeables[0]
