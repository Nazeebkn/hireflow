from cloudinary_storage.storage import MediaCloudinaryStorage  # type: ignore[import-not-found]

class AudioCloudinaryStorage(MediaCloudinaryStorage):

    def _get_resource_type(self, name):
        return "raw"