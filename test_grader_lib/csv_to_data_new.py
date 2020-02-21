from builtins import zip
import pandas, json, re

def load_csv_data(filename, xrange, yrange, width=800, height=480):
    data = pandas.read_csv(filename)

    id_ = data.ix[:,0].name  # Save ids for later
    ids = []
    ids.append(id_)
    data = data.ix[:,1].name  # Isolate the column with the actual data
#    print(data)
    d = json.loads(data) #[json.loads(d) for d in data]
    data = []
    data.append(d)
#    print(ids)
#    print(data)

    ids = [i for (i, d) in zip(ids, data)
        if 'correct_map' in d
        and list(d['correct_map'].keys())]  # hackily keep ids for the data, too

    data = [d for d in data
        if 'correct_map' in d
        and list(d['correct_map'].keys())]  # only keep entries with actual data
    
    correct_maps = [list(d['correct_map'].values())[0] for d in data]
    ans_dicts = [list(d['student_answers'].values())[0] for d in data]
    ans_dicts = [json.loads(a) for a in ans_dicts]

    return [{
        'id': i,
        'correct': True if cmap['correctness'] == 'correct' else False,
        'message': cmap['msg'],
        'gradeable': a['answer']
        } for (a, cmap, i) in zip(ans_dicts, correct_maps, ids)]
