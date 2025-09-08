import boto3
import re
from consts.s3_keys import BUCKETNAME

class EbookFileStorage:
    def __init__(self):
        self.s3 = boto3.client('s3')
        self.bucket = BUCKETNAME

    def normalize_filename(self, s):
        s = s.lower()
        s = re.sub(r'\s+', '_', s)
        s = re.sub(r'[^a-z0-9_]', '', s)
        return s

    def upload_file(self, file_bytes, title, author, user_id):
        title_norm = self.normalize_filename(title)
        author_norm = self.normalize_filename(author)
        new_file_name = f"{user_id}_{title_norm}_{author_norm}.epub"
        self.s3.put_object(Bucket=self.bucket, Key=new_file_name, Body=file_bytes)
        return new_file_name