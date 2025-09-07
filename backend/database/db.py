from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from consts.db_keys import HOST, DBNAME, USERNAME, PASSWORD

DATABASE_URL = f"postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOST}/{DBNAME}"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
