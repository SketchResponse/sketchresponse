class GradeableCollection(list):
    def __init__(self, identifier, config, gradeable_list):
        super(GradeableCollection, self).__init__(gradeable_list)
        self.identifier = identifier
        self.params = self.resolve_params_for_id(identifier, config)

    @staticmethod
    def resolve_params_for_id(identifier, config):
        resolved = config.copy()
        plugins = resolved.pop('plugins', [])  # Don't include plugins array

        for plugin_config in plugins:
            resolved.update(GradeableCollection.resolve_params_for_id(
                identifier, plugin_config))

        return resolved if resolved.get('id', None) == identifier else {}
    
