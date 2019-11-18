import pandas, json, re

def load_csv_data(filename, xrange, yrange, width=800, height=480):
    data = pandas.read_csv(filename)

    ids = data.ix[:,0]  # Save ids for later
    data = data.ix[:,1]  # Isolate the column with the actual data
    data = [json.loads(d) for d in data]

    ids = [i for (i, d) in zip(ids, data)
        if 'correct_map' in d
        and d['correct_map'].keys()]  # hackily keep ids for the data, too

    data = [d for d in data
        if 'correct_map' in d
        and d['correct_map'].keys()]  # only keep entries with actual data

    correct_maps = [d['correct_map'].values()[0] for d in data]
    ans_dicts = [d['student_answers'].values()[0] for d in data]
    ans_dicts = [json.loads(a) for a in ans_dicts]

    return [{
        'id': i,
        'correct': True if cmap['correctness'] == 'correct' else False,
        'message': cmap['msg'],
        'gradeable': a['answer']
        } for (a, cmap, i) in zip(ans_dicts, correct_maps, ids)]
